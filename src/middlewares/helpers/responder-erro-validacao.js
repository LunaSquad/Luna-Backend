import { z } from "zod";

export function responderErroValidacao(res, erro, contexto) {
  if (erro instanceof z.ZodError) {
    return res.status(400).json({
      erro: `Erro de validação ${contexto}.`,
      detalhes: erro.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      })),
    });
  }

  if (erro?.statusCode === 400) {
    return res.status(400).json({
      erro: erro.message,
    });
  }

  console.error(`Erro inesperado ${contexto}:`, erro);

  return res.status(500).json({
    erro: "Erro interno no servidor.",
  });
}