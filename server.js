const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./backend/config/db"); // Importamos la conexión a la BD
const Product = require('./backend/models/Product');
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
require("./backend/config/passport");

dotenv.config(); // Configurar variables de entorno

const app = express(); //Iniciamos express

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/css", express.static(path.join(__dirname, "frontend/css")))//Si accedemos a la carpeta madre tenemos acceso a todas sus rutas
app.use("/js", express.static(path.join(__dirname, "frontend/js")));
app.use("/pages", express.static(path.join(__dirname, "frontend/pages")));
app.use("/resources", express.static(path.join(__dirname, "frontend/resources")));
app.use("/prod_icons", express.static(path.join(__dirname, "resources/prod_icons")));

app.use(cors({
  origin: "http://localhost:5000", // Middleware para permitir solicitudes desde otros dominios (Frontend)
  credentials: true
})); 
app.use(express.json()); // Middleware para leer JSON en las peticiones

app.use(cookieParser()); // Middleware para leer cookies
app.use(session({
  secret: "clave_secreta_sesion",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Usa true si estás en HTTPS (producción)
    maxAge: 1000 * 60 * 60 * 2 // 2 horas en milisegundos
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./backend/routes/authRoutes"); // Rutas de  log/res de usuarios
app.use("/api/auth", authRoutes);

const favoritesRoutes = require("./backend/routes/favoritesRoutes"); //AQUI HAY QUE PONER LAS DE FAV-CART PARA QUE PUEDA FUNCIONAR
app.use("/api/favorites", favoritesRoutes); 
const cartRoutes = require("./backend/routes/cartRoutes"); 
app.use("/api/cart", cartRoutes); 

const productRoutes = require("./backend/routes/productRoutes"); // Rutas de productos
const storeConnection = require("./backend/config/store_db"); // conectamos a la base de datos de la tienda para guardar los productos
app.use("/api/products", productRoutes);

connectDB();// Conectar a la base de datos para el log/reg de usuarios 

const protectedRoutes = require("./backend/routes/protectedRoutes");// Importar rutas protegidas
app.use("/api/protected", protectedRoutes);

const PORT = process.env.PORT || 5000;// Puerto del servidor

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/products/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/user/product-details-page.html'));
});

app.listen(PORT, () => { // Iniciar el servidor
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

console.log("Servidor corriendo en puerto", PORT);
