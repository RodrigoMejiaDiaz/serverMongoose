const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Buscar el usuario en la base de datos y verificar las credenciales
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  // Comparar la contraseña introducida por el usuario con la contraseña hasheada almacenada en la base de datos
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Crear un token de autenticación
  const token = jwt.sign({ id: user._id }, "secreto");

  // Enviar el token al cliente
  res.json({ token });
});

module.exports = router;
