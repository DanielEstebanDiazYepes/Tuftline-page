const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Product = require("../models/Product"); // 
const ensureAuth = require("../middlewares/authMiddleware"); // Middleware para verificar autenticación

// AGREGAR AL CARRITO
router.post("/add",ensureAuth, async (req, res) => {//LE PASAMOS EL MIDDLEWARE A LA RUTA PARA QUE VERIFIQUE SI EL USUARIO ESTÁ AUTENTICADO (ESTO YA QUE SI NO ESTA AUTENTICADO NO PUEDE HACER NADA)
  console.log("Ruta /add ejecutada"); // Este console debería salir

  if (!req.user) return res.status(401).json({ message: "No autorizado" });

  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// REMOVER DEL CARRITO
router.post("/remove",ensureAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });

  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// LISTAR CARRITO
router.get("/",ensureAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });

  try {
    const user = await User.findById(req.user._id);

    console.log("Productos favoritos del usuario:", user.cart);   // Verificar si hay productos favoritos en el usuario
    const products = await Product.find({ _id: { $in: user.cart } });    // Cargar productos favoritos desde la otra base de datos (store)
    console.log("Productos encontrados:", products);// Verificar si se encontraron productos

    res.json({ success: true, cart: products });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ success: false });
  }
});

router.post("/clear", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.json({ success: true, message: "Carrito vaciado correctamente" });
  } catch (err) {
    console.error("Error al vaciar el carrito:", err);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});

module.exports = router; // Este archivo define las rutas para agregar, eliminar y listar productos favoritos de un usuario.