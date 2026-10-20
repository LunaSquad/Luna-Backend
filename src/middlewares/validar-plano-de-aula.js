import { z } from "zod";
import { objectIdSchema } from "./schemas-base.js";
import { responderErroValidacao } from "./helpers/responder-erro-validacao.js";
import { converterCamposJSON } from "./helpers/converter-campos-json.js";
import { limparArquivoCloudinary } from "./helpers/limpar-cloudinary.js";

const tipoConteudoSchema = z.preprocess(
  (valor) =>
    typeof valor === "string"
      ? valor.trim().toLowerCase()
      : valor,
  z.enum(["manual", "anexo"], {
    error: "Tipo de conteúdo inválido. Escolha Manual ou Anexo.",
  }),
);

const dataAulaSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data da aula no formato AAAA-MM-DD.")
  .refine((valor) => {
    const data = new Date(`${valor}T00:00:00.000Z`);

    return (
      !Number.isNaN(data.getTime()) &&
      data.toISOString().slice(0, 10) === valor
    );
  }, "Data da aula inválida.");


const dataFechamentoSchema = z.iso.datetime({
  offset: true,
  error: "Informe uma data de fechamento válida no formato ISO.",
});


const dadosPlanoDeAulaSchema = z.object({
  materiaId: objectIdSchema,
  turmaId: objectIdSchema,
  tipoConteudo: tipoConteudoSchema,
  titulo: z
    .string()
    .trim()
    .min(3, "O título deve ter no mínimo 3 caracteres.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  descricaoConteudo: z
    .string()
    .trim()
    .min(5, "A descrição deve ter no mínimo 5 caracteres.")
    .max(255, "A descrição deve ter no máximo 255 caracteres."),
  dataAula: dataAulaSchema,
  dataFechamento: dataFechamentoSchema,
}).strict();

// Schema de Cadastro
const registroPlanoDeAulaSchema = z.object({
  dadosPlanoDeAula: dadosPlanoDeAulaSchema,
}).strict();

// Schema de Atualização
const dadosPlanoDeAulaUpdateSchema = dadosPlanoDeAulaSchema.partial().refine(
  (dados) => Object.values(dados).some((valor) => valor !== undefined),
  "Informe pelo menos um dado do plano de aula.",
);

const updatePlanoDeAulaSchema = z.object({
  dadosPlanoDeAula: dadosPlanoDeAulaUpdateSchema.optional(),
}).strict();


// --- MIDDLEWARES ---

// Middleware de Cadastro
export const validarCadastroPlanoDeAula = async (req, res, next) => {
  try {
    converterCamposJSON(req.body, ["dadosPlanoDeAula"]);

    const dadosValidados = registroPlanoDeAulaSchema.parse(req.body);

    if (dadosValidados.dadosPlanoDeAula.tipoConteudo === "anexo" && !req.file) {
      return res.status(400).json({
        erro: "Envie o arquivo do plano de aula.",
      });
    }

    req.body = dadosValidados;

    return next();

  } catch (error) {
    await limparArquivoCloudinary(req.file);

    return responderErroValidacao(res, error, "no cadastro do plano de aula");
  }
};

// Middleware de Atualização
export const validarUpdatePlanoDeAula = async (req, res, next) => {
  try {
    converterCamposJSON(req.body, ["dadosPlanoDeAula"]);

    const dadosValidados = updatePlanoDeAulaSchema.parse(req.body);

    const temDados = Boolean(dadosValidados.dadosPlanoDeAula);
    const temNovoArquivo = Boolean(req.file);

    if (!temDados && !temNovoArquivo) {
      return res.status(400).json({
        erro: "Informe pelo menos um dado ou envie um novo arquivo para atualizar.",
      });
    }

    req.body = dadosValidados;

    return next();

  } catch (error) {
    await limparArquivoCloudinary(req.file);

    return responderErroValidacao(res, error, "na atualização do plano de aula");
  }
};