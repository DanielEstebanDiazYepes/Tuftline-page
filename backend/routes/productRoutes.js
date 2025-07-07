const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const productos = await Product.find();// Obtener todos los productos
  res.json(productos);
});

router.post('/', async (req, res) => { // Agregar un nuevo producto 
  try {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save(); //con esto se crea un nuevo producto y se guarda en la base de datos
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error });
  }
});

router.get('/search/:query', async (req, res) => { //RUTA PARA LAS BUSQUEDAS
  try {
    const regex = new RegExp(req.params.query, 'i');
    const products = await Product.find({ name: { $regex: regex } });
    res.json(products);
  } catch (err) {
    console.error("Error en búsqueda:", err);
    res.status(500).json({ error: "Error al buscar productos" });
  }
});

router.get('/category/:type', async (req, res) => { //RUTA PARA LAS BUSQUEDAS POR CATEGORÍA
  try {
    const type = req.params.type;
    const products = await Product.find({ type: type }); // busca coincidencia exacta
    res.json(products);
  } catch (err) {
    console.error("Error al buscar por categoría:", err);
    res.status(500).json({ error: "Error al buscar por categoría" });
  }
});



module.exports = router;
