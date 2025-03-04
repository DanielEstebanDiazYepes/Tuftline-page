const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // 🔹 Asegurarnos de que cargue las variables de entorno

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en el registro:", error); // 🔹 Agregamos log para debug
    res
      .status(500)
      .json({ message: "Error en el servidor al registrar usuario" });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT usando la clave secreta del .env
    // Generar token con ID y ROL del usuario
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // 🔹 Usamos la clave secreta desde .env
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("Error en el login:", error); // 🔹 Agregamos log para debug
    res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };
