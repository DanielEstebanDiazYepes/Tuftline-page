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

module.exports = router;
