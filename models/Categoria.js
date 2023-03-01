const mongoose = require("mongoose");

const CategoriaSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true,
  },
});

module.exports = Categoria = mongoose.model("categoria", CategoriaSchema);
