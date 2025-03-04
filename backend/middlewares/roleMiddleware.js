const roleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
      if (!rolesPermitidos.includes(req.user.role)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  