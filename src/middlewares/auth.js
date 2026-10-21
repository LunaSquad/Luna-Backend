import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Acesso negado. Token não fornecido.",
    });
  }

  const partes = authHeader.match(/^Bearer\s+(\S+)$/i);

  if (!partes) {
    return res.status(401).json({
      erro: "Erro de formatação no Token.",
    });
  }

  const token = partes[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET não foi configurado.");

    return res.status(500).json({
      erro: "Erro interno no servidor.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      Array.isArray(decoded)
    ) {
      return res.status(401).json({
        erro: "Token inválido ou expirado.",
      });
    }

    req.usuario = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      erro: "Token inválido ou expirado.",
    });
  }
};