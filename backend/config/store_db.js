const mongoose = require("mongoose");
require("dotenv").config();

const storeConnection = mongoose.createConnection(process.env.STORE_URL);

storeConnection.on("connected", () => {
  console.log("✅ Conectado a la StoreDB");
});

storeConnection.on("error", (err) => {
  console.error("❌ Error al conectar a StoreDB:", err);
});

module.exports = storeConnection;
