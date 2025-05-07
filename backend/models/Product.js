const mongoose = require('mongoose');
const storeConnection = require('../config/store_db');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String
});

module.exports = storeConnection.model('Product', productSchema);
  