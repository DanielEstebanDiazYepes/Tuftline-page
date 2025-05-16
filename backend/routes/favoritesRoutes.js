const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Product = require("../models/Product"); // 
const ensureAuth = require("../middlewares/authMiddleware"); // Middleware para verificar autenticación

// AGREGAR A FAVORITOS
router.post("/add",ensureAuth, async (req, res) => {//LE PASAMOS EL MIDDLEWARE A LA RUTA PARA QUE VERIFIQUE SI EL USUARIO ESTÁ AUTENTICADO (ESTO YA QUE SI NO ESTA AUTENTICADO NO PUEDE HACER NADA)
  console.log("Ruta /add ejecutada"); // Este console debería salir

  if (!req.user) return res.status(401).json({ message: "No autorizado" });

  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// REMOVER DE FAVORITOS
router.post("/remove",ensureAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });

  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// LISTAR FAVORITOS
router.get("/",ensureAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });

  try {
    const user = await User.findById(req.user._id);

    console.log("Productos favoritos del usuario:", user.favorites);   // Verificar si hay productos favoritos en el usuario
    const products = await Product.find({ _id: { $in: user.favorites } });    // Cargar productos favoritos desde la otra base de datos (store)
    console.log("Productos encontrados:", products);// Verificar si se encontraron productos

    res.json({ success: true, favorites: products });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router; // Este archivo define las rutas para agregar, eliminar y listar productos favoritos de un usuario.