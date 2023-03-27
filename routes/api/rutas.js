const express = require("express");
const router = express.Router();
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const os = require("os");

const storageM = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage: storageM, fileFilter });

const keyfile = [
  process.env.type,
  process.env.project_id,
  process.env.private_key_id,
  process.env.private_key,
  process.env.client_email,
  process.env.client_id,
  process.env.auth_uri,
  process.env.token_uri,
  process.env.auth_provider_x509_cert_url,
  process.env.client_x509_cert_url,
];

const storage = new Storage({
  projectId: "deep-clock-381322",
  keyFilename: keyfile,
});

const bucket = storage.bucket("corporacionmdc-imgs");

const subirImagen = async (archivo) => {
  try {
    const nombreArchivo = uuidv4() + path.extname(archivo.originalname);
    const archivoStream = archivo.path;
    const opcionesUpload = {
      destination: nombreArchivo,
      resumable: false,
      metadata: {
        contentType: archivo.mimetype,
      },
    };
    await bucket.upload(archivoStream, opcionesUpload);
    const url = `https://storage.googleapis.com/${bucket.name}/${nombreArchivo}`;
    console.log("Se subió la imagen al url:" + url);
    return url;
  } catch (error) {
    console.log(error);
    throw new Error("Error al subir la imagen al bucket");
  }
};

async function deleteImageFromBucket(filename) {
  // Elimina la imagen del bucket
  await bucket.file(filename).delete();

  console.log(`Imagen ${filename} eliminada del bucket`);
}

// Load Categoria model
const Categoria = require("../../models/Categoria");

router.get("/test", (req, res) => res.send("categoria route testing!"));

// @route GET api/categorias
// @description Get all categorias
// @access Public
router.get("/categorias", (req, res) => {
  Categoria.find()
    .then((categorias) => res.json(categorias))
    .catch((err) =>
      res.status(404).json({ nohaycategoria: "No Categoria encontrada" })
    );
});

// @route GET api/categorias/:id
// @description Get single categoria by id
// @access Public
router.get("/categorias/:id", (req, res) => {
  Categoria.findById(req.params.id)
    .then((categoria) => res.json(categoria))
    .catch((err) =>
      res.status(404).json({ nohaycategoria: "No Categoria encontrada" })
    );
});

// Load Producto model
const Producto = require("../../models/Producto");

// @route GET api/productos
// @description Get all productos
// @access Public
router.get("/productos", (req, res) => {
  Producto.find()
    .then((productos) => res.json(productos))
    .catch((err) =>
      res.status(404).json({ nohayproductos: "No Productos encontrados" })
    );
});

// @route GET api/productos/:id
// @description Get single producto by id
// @access Public
router.get("/productos/:id", (req, res) => {
  Producto.findById(req.params.id)
    .then((producto) => res.json(producto))
    .catch((err) =>
      res.status(404).json({ nohayproductos: "No Productos encontrados" })
    );
});

// @route POST api/productos
// @description Add a new producto
// @access Public
router.post("/productos", upload.single("img"), async (req, res) => {
  try {
    const { nombre, desc, marca, categoria } = req.body;
    const img = await subirImagen(req.file);
    const nuevoProducto = new Producto({
      nombre,
      desc,
      marca,
      categoria,
      img,
    });
    const productoGuardado = await nuevoProducto.save();
    res.json(productoGuardado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al guardar el producto" });
  }
});

// @route PUT api/productos
// @description Editar un producto
// @access Public
router.put("/productos/:id", upload.single("img"), async (req, res) => {
  try {
    const { nombre, desc, marca, img, categoria } = req.body;

    // Verificar si existe el producto
    const productoExistente = await Producto.findById(req.params.id);

    if (!productoExistente) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Actualizar el producto
    productoExistente.nombre = nombre;
    productoExistente.desc = desc;
    productoExistente.marca = marca;
    productoExistente.categoria = categoria;
    if (productoExistente.img !== img) {
      const filename = path.basename(productoExistente.img);
      await deleteImageFromBucket(filename);
      const img = await subirImagen(req.file);
      productoExistente.img = img;
    }

    const productoActualizado = await productoExistente.save();
    res.json(productoActualizado);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// @route DELETE api/productos/:id
// @desc Elimina un producto por su ID
// @access Public
router.delete("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    const filename = path.basename(producto.img);
    await deleteImageFromBucket(filename);

    await producto.deleteOne();

    res.json({ msg: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
