export const somenteProfessor = (req, res, next) => {
  if (
    req.usuario?.tipoUser !== "professor" ||
    !req.usuario?.professorId
  ) {
    return res.status(403).json({
      erro: "Acesso permitido apenas para professores.",
    });
  }

  return next();
};