import { z } from "zod";
import { responderErroValidacao } from "../helpers/responder-erro-validacao.js";

const correcaoAtividadeSchema = z
  .object({
    comentarioProfessor: z
      .string({ required_error: "O comentário do professor é obrigatório." })
      .trim()
      .min(1, "Digite um comentário antes de enviar o feedback.")
      .max(2000, "O comentário deve ter no máximo 2000 caracteres."),
  })
  .strict();

// --- MIDDLEWARE ---

export const validarCorrecaoAtividade = (req, res, next) => {
  try {
    req.body = correcaoAtividadeSchema.parse(req.body);
    return next();
  } catch (error) {
    return responderErroValidacao(res, error, "na correção da atividade");
  }
};
