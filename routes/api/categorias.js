const express = require("express");
const router = express.Router();

// Load Book model
const Categoria = require("../../models/Categoria");

router.get("/test", (req, res) => res.send("book route testing!"));

// @route GET api/categorias
// @description Get all categorias
// @access Public
router.get("/categorias", (req, res) => {
  Categoria.find()
    .then(categorias => res.json(categorias))
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

module.exports = router;
