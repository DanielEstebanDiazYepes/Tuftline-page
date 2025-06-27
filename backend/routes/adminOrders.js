const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const ensureAuth = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(ensureAuth, roleMiddleware(["admin"]));

// Obtener todas las órdenes
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 }) // Ordenar por fecha más reciente
            .populate("user", "name email");
            
        res.json(orders);
    } catch (err) {
        console.error("Error al obtener órdenes:", err);
        res.status(500).json({ error: "Error al obtener órdenes" });
    }
});

// Obtener detalles de una orden específica
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email");
            
        if (!order) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        
        res.json(order);
    } catch (err) {
        console.error("Error al obtener orden:", err);
        res.status(500).json({ error: "Error al obtener orden" });
    }
});

// Actualizar estado de una orden
router.put("/:id", async (req, res) => {
    const { status } = req.body;

    if (!["pending", "processing", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Estado inválido" });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Orden no encontrada" });

        order.status = status;
        await order.save();

        res.json({ message: "Estado actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar estado:", err);
        res.status(500).json({ error: "Error al actualizar estado" });
    }
});


//Ruta para eliminar una orden
router.delete("/:id/", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }

        res.json({ message: "Orden eliminada correctamente" });
    } catch (err) {
        console.error("Error al eliminar orden:", err);
        res.status(500).json({ error: "Error al eliminar orden" });
    }
});


module.exports = router;