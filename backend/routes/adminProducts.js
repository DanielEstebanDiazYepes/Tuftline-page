// routes/adminProducts.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const ensureAuth = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Solo admins pueden acceder
router.use(ensureAuth, roleMiddleware(["admin"]));

// Obtener todos los productos (para admin)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Crear producto
router.post("/", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: "Error al crear producto" });
    }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: "Error al actualizar producto" });
    }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Error al eliminar producto" });
    }
});

module.exports = router;