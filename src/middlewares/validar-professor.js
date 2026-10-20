import { z } from "zod";
import { nomeSchema, sobrenomeSchema, emailSchema, cpfSchema, senhaSchema, dataNascSchema, telefoneSchema } from "./schemas-base.js";
import { responderErroValidacao } from "./helpers/responder-erro-validacao.js";
import { converterCamposJSON } from "./helpers/converter-campos-json.js";
import { limparArquivoCloudinary } from "./helpers/limpar-cloudinary.js";

const dadosUsuarioSchema = z.object({
  email: emailSchema,
  senha: senhaSchema,
}).strict();

const dadosProfessorSchema = z.object({
  nome: nomeSchema,
  sobrenome: sobrenomeSchema,
  cpf: cpfSchema,
  dataNasc: dataNascSchema,
  cidade: z
    .string()
    .trim()
    .min(2, "A cidade deve ter pelo menos 2 caracteres.")
    .max(100, "A cidade deve ter no máximo 100 caracteres."),
  telefone: telefoneSchema,
}).strict();

// Schema de Cadastro
const registroProfessorSchema = z.object({
  dadosUsuario: dadosUsuarioSchema,
  dadosProfessor: dadosProfessorSchema,
}).strict();

// Schema de Atualização
const dadosUsuarioUpdateSchema = dadosUsuarioSchema.partial().refine(
  (dados) => Object.values(dados).some((valor) => valor !== undefined),
  "Informe pelo menos um dado do usuário.",
);

const dadosProfessorUpdateSchema = dadosProfessorSchema.partial().refine(
  (dados) => Object.values(dados).some((valor) => valor !== undefined),
  "Informe pelo menos um dado do professor.",
);

const updateProfessorSchema = z.object({
  dadosUsuario: dadosUsuarioUpdateSchema.optional(),
  dadosProfessor: dadosProfessorUpdateSchema.optional(),
}).strict();


// --- MIDDLEWARES ---

// Middleware de Cadastro
export const validarCadastroProfessor = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        erro: "A foto de perfil é obrigatória.",
      });
    }

    converterCamposJSON(req.body, ["dadosUsuario", "dadosProfessor"]);

    req.body = registroProfessorSchema.parse(req.body);

    return next();

  } catch (error) {
    await limparArquivoCloudinary(req.file);

    return responderErroValidacao(res, error, "no cadastro do professor");
  }
};

// Middleware de Atualização
export const validarUpdateProfessor = async (req, res, next) => {
  try {
    converterCamposJSON(req.body, ["dadosUsuario", "dadosProfessor"]);

    const dadosValidados = updateProfessorSchema.parse(req.body);

    const temDadosUsuario = Boolean(dadosValidados.dadosUsuario);
    const temDadosProfessor = Boolean(dadosValidados.dadosProfessor);
    const temNovaFoto = Boolean(req.file);

    if (!temDadosUsuario && !temDadosProfessor && !temNovaFoto) {
      return res.status(400).json({
        erro: "Informe pelo menos um dado ou uma nova foto para atualizar.",
      });
    }

    req.body = dadosValidados;

    return next();

  } catch (error) {
    await limparArquivoCloudinary(req.file);

    return responderErroValidacao(res, error, "na atualização do professor");
  }
};