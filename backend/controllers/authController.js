const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { name, address, phone, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    // Usar req.login() de Passport para iniciar sesión automáticamente después del registro
    req.login(user, (err) => {
      if (err) {
        console.error("Error al iniciar sesión después del registro:", err);
        return res.status(500).json({ message: "Error al iniciar sesión" });
      }
      return res.status(201).json({ 
        message: "Usuario registrado correctamente", 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });

  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error en el servidor al registrar usuario" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Usar req.login() de Passport para establecer la sesión
    req.login(user, (err) => {
      if (err) {
        console.error("Error al iniciar sesión:", err);
        return res.status(500).json({ message: "Error al iniciar sesión" });
      }

      const token = jwt.sign(       // Generar token JWT si lo necesitas para APIs
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({ 
        message: "Login exitoso", 
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });

  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };