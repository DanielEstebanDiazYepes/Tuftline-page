const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const ensureAuth = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadmiddlewares");

// Seguridad: solo admin autenticado
router.use(ensureAuth, roleMiddleware(["admin"]));

// GET: Ver todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// POST: Crear producto con imagen local
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, type, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Debe subir una imagen" });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Ruta accesible desde el navegador

    const newProduct = new Product({
      name,
      type,
      description,
      price,
      imageUrl
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Error al crear producto" });
  }
});

// PUT: Actualizar producto
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

// DELETE: Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
