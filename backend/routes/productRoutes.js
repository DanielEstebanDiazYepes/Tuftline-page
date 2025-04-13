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

module.exports = router;
