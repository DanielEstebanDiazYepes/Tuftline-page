const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Ruta protegida solo para admins
router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Bienvenido, Admin" });
});

// Ruta accesible para todos los usuarios autenticados
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Accediste a una ruta protegida", user: req.user });
});

router.get("/user", (req, res) => {// Ruta para obtener datos del usuario autenticado
  if (req.isAuthenticated()) {
    const { name, email, address, phone } = req.user;
    res.json({ name, email, address, phone});
  } else {
    res.status(401).json({ error: "Usuario no autenticado" });
  }
});

module.exports = router;
