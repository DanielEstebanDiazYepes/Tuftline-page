// Importar módulos necesarios
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./backend/config/db"); // Importamos la conexión a la BD

// Configurar variables de entorno
dotenv.config();

//require("dotenv").config();

// Inicializar la app de Express
const app = express();

// Middleware para permitir solicitudes desde otros dominios (Frontend)
app.use(cors());

// Middleware para leer JSON en las peticiones
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Importar rutas
const authRoutes = require("./backend/routes/authRoutes");
app.use("/api/auth", authRoutes);

// Importar rutas protegidas
const protectedRoutes = require("./backend/routes/protectedRoutes");
app.use("/api/protected", protectedRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

console.log("Servidor funcionando correctamente");
