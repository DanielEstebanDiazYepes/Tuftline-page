const express = require("express");
const router = express.Router();
const ensureAuth = require("../middlewares/authMiddleware");
const Order = require("../models/Order");

// Obtener las órdenes del usuario autenticado
router.get("/orders", ensureAuth, async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(userOrders);
  } catch (err) {
    console.error("Error al obtener órdenes del usuario:", err);
    res.status(500).json({ error: "Error al obtener tus facturas" });
  }
});

module.exports = router;
