// routes/adminOrders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Necesitas crear este modelo
const ensureAuth = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(ensureAuth, roleMiddleware(["admin"]));

// Obtener todas las órdenes
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener órdenes" });
    }
});

module.exports = router;