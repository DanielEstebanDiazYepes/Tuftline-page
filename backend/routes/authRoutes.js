const express = require("express");
const passport = require("passport");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

// Ruta para registro
router.post("/register", registerUser);

// Ruta para login
router.post("/login", loginUser);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }), 
  (req, res) => {
    res.redirect("/index.html"); // o donde desees
  }
);

module.exports = router;
