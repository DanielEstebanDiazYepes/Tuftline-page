const express = require("express");
const passport = require("passport");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser); // Ruta para registro
router.post("/login", loginUser); // Ruta para login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login.html" }),

  (req, res) => {
    req.session.user = {
      id: req.user._id, // Con esto hacemos que el login y el register de google funcionen
      name: req.user.name,
      role: req.user.role
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


module.exports = router;
