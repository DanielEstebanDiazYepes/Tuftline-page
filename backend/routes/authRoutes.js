const express = require("express");
const passport = require("passport");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const ensureAuth = require("../middlewares/authMiddleware"); // Middleware para verificar autenticación
const { registerUser, loginUser, verifyEmail } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser); // Ruta para registro
router.post("/login", loginUser); // Ruta para login +
router.get("/verify-email", verifyEmail);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login.html" }),

  (req, res) => {  
    res.redirect("/index.html");
  }
);

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) { // Método de Passport
    res.json({ 
      loggedIn: true, 
      user: {
        id: req.user._id,
        name: req.user.name,
        address: req.user.address,
        phone: req.user.phone,
        email: req.user.email,
        role: req.user.role
      }
    });
  } else {
    res.json({ loggedIn: false });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
    }

    // Destruir la sesión
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error al destruir la sesión" });
      }

      res.clearCookie("connect.sid"); // Limpia la cookie de sesión
      res.json({ success: true, message: "Sesión cerrada" });
    });
  });
});


router.put("/update", ensureAuth, async (req, res) => {//RUTA PARA ACTUALIZAR LA INFORMACION DEL USUARIO
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const userId = req.user._id;
    const { name, address, phone, email, password } = req.body;

    const updatedFields = { name, address, phone, email }; //AQUI SE GUARDAN LOS DATOS ACTUALIZADOS (MENOS LA CONTRASEÑA)

    if (password && password.trim() !== "") {//ESTE CODIGO INCRIPTA LA CONTRASEÑA SI SE ACTUALIZA
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true }); //NO SE QUE HACE AQUI 
    
  //ACTUALIZA LA SESION DEL USUARIO CON LOS NUEVOS DATOS

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error al actualizar:", err);
    res.status(500).json({ success: false, message: "Error al actualizar usuario" });
  }
});


router.delete("/delete", ensureAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    await User.findByIdAndDelete(req.user._id);

    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
      }
      
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Error al destruir sesión" });
        }

        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    res.status(500).json({ success: false, message: "Error al eliminar la cuenta" });
  }
});

module.exports = router;
