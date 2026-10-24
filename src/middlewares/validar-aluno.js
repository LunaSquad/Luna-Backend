import { z } from "zod";
import { nomeSchema, emailSchema, cpfSchema, senhaSchema, dataNascSchema, telefoneSchema } from "./schemas-base.js";
import { responderErroValidacao } from "./helpers/responder-erro-validacao.js";
import { converterCamposJSON } from "./helpers/converter-campos-json.js";
import { limparArquivoCloudinary, limparArquivosMultiplosCloudinary } from "./helpers/limpar-cloudinary.js";

const dadosUsuarioSchema = z.object({
  email: emailSchema,
  senha: senhaSchema,
}).strict();

const dadosAlunoSchema = z.object({
  nome: nomeSchema,
  nomeResponsavel: nomeSchema,
  cpf: cpfSchema,
  cpfResponsavel: cpfSchema,
  dataNasc: dataNascSchema,
  telefone: telefoneSchema
}).strict();

// Schema de Cadastro (Todos os campos de Cadastro)
const registroAlunoSchema = z.object({
  dadosUsuario: dadosUsuarioSchema,
  dadosAluno: dadosAlunoSchema,
}).strict();

// Schema de Atualização (Permite campos isolados de Cadastro)
const dadosUsuarioUpdateSchema = dadosUsuarioSchema.partial().refine(
  (dados) => Object.values(dados).some((valor) => valor !== undefined),
  "Informe pelo menos um dado do usuário."
);

const dadosAlunoUpdateSchema = dadosAlunoSchema.partial().refine(
  (dados) => Object.values(dados).some((valor) => valor !== undefined),
  "Informe pelo menos um dado do aluno."
);

const updateAlunoSchema = z.object({
  dadosUsuario: dadosUsuarioUpdateSchema.optional(),
  dadosAluno: dadosAlunoUpdateSchema.optional(),
}).strict();

// Schema Editar Hiperfoco
const updateHiperfocoSchema = z.object({
  hiperfoco: z
    .string()
    .trim()
    .min(2, "O hiperfoco deve ter pelo menos 2 caracteres.")
    .max(100, "O hiperfoco deve ter no máximo 100 caracteres.")
    .optional(),
}).strict();

// --- MIDDLEWARES ---

// Middleware de Cadastro
export const validarCadastroAluno = async (req, res, next) => {
  try {
    const temFotoAluno = Boolean(req.files?.fotoAluno?.[0]);
    const temFotoLaudo = Boolean(req.files?.fotoLaudo?.[0]);

    if (!temFotoAluno || !temFotoLaudo) {
      await limparArquivosMultiplosCloudinary(req.files);
      return res.status(400).json({
        erro: "A foto do aluno e a foto do laudo são obrigatórias no cadastro.",
      });
    }

    converterCamposJSON(req.body, ["dadosUsuario", "dadosAluno"]);

    req.body = registroAlunoSchema.parse(req.body);

    return next();

  } catch (error) {
    await limparArquivosMultiplosCloudinary(req.files);

    return responderErroValidacao(res, error, "no cadastro do aluno");
  }
};

// Middleware de Atualização Geral
export const validarUpdateAluno = async (req, res, next) => {
  try {
    converterCamposJSON(req.body, ["dadosUsuario", "dadosAluno"]);

    const dadosValidados = updateAlunoSchema.parse(req.body);

    const temDadosUsuario = Boolean(dadosValidados.dadosUsuario);
    const temDadosAluno = Boolean(dadosValidados.dadosAluno);
    const temNovaFotoAluno = Boolean(req.files?.fotoAluno?.[0]);
    const temNovaFotoLaudo = Boolean(req.files?.fotoLaudo?.[0]);

    if (!temDadosUsuario && !temDadosAluno && !temNovaFotoAluno && !temNovaFotoLaudo) {
      await limparArquivosMultiplosCloudinary(req.files);

      return res.status(400).json({
        erro: "Envie pelo menos um dado ou uma nova foto para atualizar.",
      });
    }

    req.body = dadosValidados;

    return next();

  } catch (error) {
    await limparArquivosMultiplosCloudinary(req.files);
    return responderErroValidacao(res, error, "na atualização do aluno");
  }
};

// Middleware de Hiperfoco
export const validarUpdateHiperfoco = async (req, res, next) => {
  try {
    const dadosValidados = updateHiperfocoSchema.parse(req.body);

    const temTextoHiperfoco = dadosValidados.hiperfoco !== undefined;
    const temFotoHiperfoco = Boolean(req.file);

    if (!temTextoHiperfoco && !temFotoHiperfoco) {
      return res.status(400).json({
        erro: "Informe o nome do hiperfoco ou envie uma foto do hiperfoco.",
      });
    }

    req.body = dadosValidados;

    return next();

  } catch (error) {
    await limparArquivoCloudinary(req.file);

    return responderErroValidacao(res, error, "na atualização do hiperfoco");
  }
};