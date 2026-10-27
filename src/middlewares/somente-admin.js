export const somenteAdmin = (req, res, next) => {
  if (req.usuario?.tipoUser !== "admin") {
    return res.status(403).json({
      erro: "Acesso permitido apenas para administradores.",
    });
  }

  return next();
};