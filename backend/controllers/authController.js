const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // 🔹 Asegurarnos de que cargue las variables de entorno

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { name, address, phone, email, password, role} = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);     // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ // Crear usuario
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    req.session.user = user;
    req.session.save(err => {
      if (err) {
        console.error("❌ Error al guardar sesión:", err);
        return res.status(500).send("Error al guardar sesión");
      }
      res.redirect("/index.html");
    });
    

    return res.status(201).json({ message: "Usuario registrado correctamente", user: req.session.user });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error en el servidor al registrar usuario" });
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

    req.session.user = {
      id: user._id,
      name: user.name,
      role: user.role
    };

    return res.json({ message: "Login exitoso", token, user: req.session.user });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };
