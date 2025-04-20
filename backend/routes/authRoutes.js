const express = require("express");
const passport = require("passport");
const User = require("../models/users");
const bcrypt = require("bcryptjs"); 
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser); // Ruta para registro
router.post("/login", loginUser); // Ruta para login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login.html" }),

  (req, res) => {
    req.session.user = { // Con esto hacemos que el login y el register de google funcionen
      id: req.user._id,
      name: req.user.name,
      address: req.user.address,
      phone: req.user.phone,
      email: req.user.email,
    };
    res.redirect("/index.html");
  }
);

router.get("/me", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
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


router.put("/update", async (req, res) => {//RUTA PARA ACTUALIZAR LA INFORMACION DEL USUARIO
  if (!req.session.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const userId = req.session.user.id;
    const { name, address, phone, email, password } = req.body;

    const updatedFields = { name, address, phone, email }; //AQUI SE GUARDAN LOS DATOS ACTUALIZADOS (MENOS LA CONTRASEÑA)

    if (password && password.trim() !== "") {//ESTE CODIGO INCRIPTA LA CONTRASEÑA SI SE ACTUALIZA
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true }); //NO SE QUE HACE AQUI XD

    req.session.user = {//ACTUALIZA LA SESION DEL USUARIO CON LOS NUEVOS DATOS
      id: user.id,
      name: user.name,
      address: user.address,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error al actualizar:", err);
    res.status(500).json({ success: false, message: "Error al actualizar usuario" });
  }
});


router.delete("/delete", async (req, res) => {//RUTA PARA BORRAR 
  if (!req.session.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    await User.findByIdAndDelete(req.session.user.id);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar la cuenta" });
  }
});




module.exports = router;
