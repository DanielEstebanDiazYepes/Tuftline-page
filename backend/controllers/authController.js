const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // Para generar tokens únicos
const { sendEmail } = require("../utils/mailer"); // <-- ¡Importamos tu función genérica de envío de correo!
require("dotenv").config();

// Función de Registro de Usuario
const registerUser = async (req, res) => {
  try {
    const { name, address, phone, email, password, role } = req.body;

    // 1. Validación de campos (básica)
    if (!name || !address || !phone || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // 2. Verificar si el usuario ya existe por email o teléfono
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado." });
    }
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
        return res.status(400).json({ message: "El número de teléfono ya está registrado." });
    }

    // 3. Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Generar token de verificación y su expiración
    const verificationToken = uuidv4(); // Genera un UUID para el token
    const verificationTokenExpires = Date.now() + 3600000; // Expira en 1 hora (en milisegundos)

    // 5. Crear el nuevo usuario (inicialmente NO VERIFICADO)
    const user = new User({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: false, // ¡Muy importante! Por defecto es false
      verificationToken,
      verificationTokenExpires,
    });

    await user.save(); // Guarda el usuario con el token de verificación

    // 6. Preparar y enviar el correo de verificación
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${user.verificationToken}`; // Enlace para que el usuario haga clic

    const htmlContentEmail = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>¡Bienvenido/a a Tienda Online!</h2>
        <p>Gracias por registrarte. Para activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
        <p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Verificar mi correo electrónico
          </a>
        </p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no te registraste en nuestra plataforma, por favor ignora este correo.</p>
        <p>Saludos cordiales,<br/>El equipo de Tienda Online</p>
      </div>
    `;

    try {
      await sendEmail(user.email, "Verifica tu cuenta en Tienda Online", htmlContentEmail);
    } catch (emailError) {
      console.error("Error al enviar el correo de verificación:", emailError);
      // Opcional: Si el correo falla catastróficamente, podrías decidir borrar el usuario
      // para evitar cuentas "muertas" no verificables. Esto depende de tu política.
      // await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        message: "Usuario registrado, pero hubo un error al enviar el correo de verificación. Por favor, inténtalo de nuevo más tarde o contacta a soporte.",
      });
    }

    // 7. Responder al cliente. No logueamos al usuario automáticamente.
    return res.status(201).json({
      message: "Usuario registrado correctamente. Por favor, revisa tu correo electrónico para activar tu cuenta. Revisa también tu carpeta de spam.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error en el servidor al registrar usuario" });
  }
};

// Nueva función para verificar el correo
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query; // El token viene en la URL como parámetro de consulta

    if (!token) {
      // Usar status 400 para "Bad Request"
      return res.status(400).send("Token de verificación no proporcionado.");
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // Que el token sea válido y no haya expirado
    });

    if (!user) {
      // Importante: No dar muchos detalles si el token es inválido o expirado por seguridad
      return res.status(400).send("El enlace de verificación es inválido o ha expirado. Por favor, intenta registrarte de nuevo o contacta a soporte.");
    }

    // Marcar el usuario como verificado y limpiar los campos del token
    user.isVerified = true;
    user.verificationToken = undefined; // Eliminar el token usado
    user.verificationTokenExpires = undefined; // Eliminar la expiración

    await user.save(); // Guarda los cambios en el usuario

    // Redirigir al usuario a una página de éxito en el frontend
    // Utiliza CLIENT_URL para redirigir correctamente
    res.redirect(`${process.env.CLIENT_URL}/pages/auth/login.html?verified=true`); // ¡Ajusta esta ruta a tu página de login!

  } catch (error) {
    console.error("Error al verificar correo electrónico:", error);
    res.status(500).send("Hubo un error en el servidor al verificar tu correo electrónico.");
  }
};

// Función de Login de Usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // ¡NUEVO! Verificar si la cuenta está verificada antes de permitir el login
    if (!user.isVerified) {
      return res.status(403).json({ message: "Por favor, verifica tu correo electrónico para iniciar sesión. Revisa tu bandeja de entrada o la carpeta de spam." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Si todo es correcto y la cuenta está verificada, usa req.login() de Passport
    req.login(user, (err) => {
      if (err) {
        console.error("Error al iniciar sesión con Passport:", err);
        return res.status(500).json({ message: "Error al iniciar sesión." });
      }

      // Si necesitas un token JWT para APIs (aparte de la sesión de Passport)
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login exitoso",
        token, // Puede ser útil para clientes API
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });

  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser, verifyEmail }; // Exporta también verifyEmail