// Importar módulos necesarios
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./backend/config/db"); // Importamos la conexión a la BD
const session = require("express-session");
const passport = require("passport");
require("./backend/config/passport");


// Configurar variables de entorno
dotenv.config();


const app = express(); //Iniciamos express

app.use(cors()); // Middleware para permitir solicitudes desde otros dominios (Frontend)
app.use(express.json()); // Middleware para leer JSON en las peticiones

app.use(
  session({
    secret: "clave_secreta_sesion",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();// Conectar a la base de datos

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
console.log("Servidor corriendo en puerto", PORT);
