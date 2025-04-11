// Importar módulos necesarios
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./backend/config/db"); // Importamos la conexión a la BD
const session = require("express-session");
const passport = require("passport");
const path = require("path");
require("./backend/config/passport");

dotenv.config(); // Configurar variables de entorno

const app = express(); //Iniciamos express

app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "frontend/css")));
app.use("/js", express.static(path.join(__dirname, "frontend/js")));
app.use("/pages", express.static(path.join(__dirname, "frontend/pages")));
app.use("/resources", express.static(path.join(__dirname, "frontend/resources")));

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

const authRoutes = require("./backend/routes/authRoutes"); // Importar rutas

app.use("/api/auth", authRoutes);

const protectedRoutes = require("./backend/routes/protectedRoutes");// Importar rutas protegidas

app.use("/api/protected", protectedRoutes);

const PORT = process.env.PORT || 5000;// Puerto del servidor

app.listen(PORT, () => { // Iniciar el servidor
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

console.log("Servidor funcionando correctamente");
console.log("Servidor corriendo en puerto", PORT);
