const express = require("express");
const router = express.Router();

// Load Book model
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
module.exports = router;
