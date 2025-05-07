const jwt = require("jsonwebtoken");

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // debe continuar la ruta
  }
  res.status(401).json({ message: "No autorizado" }); // debe responder si no está autenticado
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Auth Header recibido:", authHeader); //  Ver qué llega

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Acceso denegado, token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extraído:", token); //  Ver el token limpio

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded); //  Ver el contenido del token
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar token:", error.message); //  Mostrar error real
    res.status(403).json({ message: "Token no válido" });
  }
};

const adminMiddleware = (req, res, next) => { //ESTO ES PARA LA PAGINA DE LOS ADMINSSSSS RECORDARR!!!!!!!!!!!!!
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        message: "Acceso denegado, necesitas permisos de administrador",
      });
  }
  next();
};

const verifyRole = (role) => {
  return (req, res, next) => {
      if (req.user.role !== role) {
          return res.status(403).json({ message: "Acceso denegado" });
      }
      next();
  };
};

module.exports = authMiddleware;
module.exports = ensureAuth;

