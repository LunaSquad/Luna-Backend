import { z } from "zod";
import { nomeSchema } from "../schemas-base.js";
import { responderErroValidacao } from "../helpers/responder-erro-validacao.js";

const dadosTurmaSchema = z.object({
  nome: nomeSchema,
}).strict();

// Schema de Cadastro
const registroTurmaSchema = z.object({
  dadosTurma: dadosTurmaSchema,
}).strict();

// Schema de Atualização
const dadosTurmaUpdateSchema = dadosTurmaSchema.partial().refine(
  (dados) => Object.values(dados).some((valor) => valor !== undefined),
  "Informe pelo menos um dado da turma.",
);

const updateTurmaSchema = z.object({
  dadosTurma: dadosTurmaUpdateSchema.optional(),
}).strict();

// --- MIDDLEWARES ---

// Middleware de Cadastro
export const validarCadastroTurma = (req, res, next) => {
  try {
    req.body = registroTurmaSchema.parse(req.body);

    return next();

  } catch (error) {
    return responderErroValidacao(res, error, "no cadastro da turma");
  }
};

// Middleware de Atualização
export const validarUpdateTurma = (req, res, next) => {
  try {
    const dadosValidados = updateTurmaSchema.parse(req.body);
    const temDadosTurma = Boolean(dadosValidados.dadosTurma);

    if (!temDadosTurma) {
      return res.status(400).json({
        erro: "Informe pelo menos um dado da turma para atualizar.",
      });
    }

    req.body = dadosValidados;

    return next();

  } catch (error) {
    return responderErroValidacao(res, error, "na atualização da turma");
  }
};