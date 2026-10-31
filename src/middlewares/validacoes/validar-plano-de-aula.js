import { z } from "zod";
import {
  objectIdSchema,
  criarDataSchema,
  horarioSchema,
} from "../schemas-base.js";
import { responderErroValidacao } from "../helpers/responder-erro-validacao.js";
import { converterCamposJSON } from "../helpers/converter-campos-json.js";
import { limparArquivoCloudinary } from "../helpers/limpar-cloudinary.js";

const tipoConteudoSchema = z.preprocess(
  (valor) => (typeof valor === "string" ? valor.trim().toLowerCase() : valor),
  z.enum(["manual", "anexo"], {
    error: "Tipo de conteúdo inválido. Escolha manual ou anexo.",
  })
);

const dadosPlanoDeAulaBaseSchema = z
  .object({
    materiaId: objectIdSchema,
    turmaId: objectIdSchema,
    tipoConteudo: tipoConteudoSchema,
    titulo: z
      .string()
      .trim()
      .min(3, "O título deve ter no mínimo 3 caracteres.")
      .max(100, "O título deve ter no máximo 100 caracteres.")
      .optional(),
    descricao: z
      .string()
      .trim()
      .min(5, "A descrição deve ter no mínimo 5 caracteres.")
      .max(1000, "A descrição deve ter no máximo 1000 caracteres.")
      .optional(),
    dataAula: criarDataSchema("data da aula"),
    dataFechamento: criarDataSchema("data de fechamento"),
    horarioFechamento: horarioSchema,
  })
  .strict();

// Schema de Cadastro
const registroPlanoDeAulaSchema = z
  .object({
    dadosPlanoDeAula: dadosPlanoDeAulaBaseSchema
      .superRefine((dados, ctx) => {
        if (dados.tipoConteudo === "manual") {
          if (!dados.titulo) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "O título é obrigatório no modo manual.",
              path: ["titulo"],
            });
          }
          if (!dados.descricao) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "A descrição é obrigatória no modo manual.",
              path: ["descricao"],
            });
          }
        }

        if (dados.dataFechamento < dados.dataAula) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "A data de fechamento não pode ser anterior à data da aula.",
            path: ["dataFechamento"],
          });
        }
      })
      .transform(({ horarioFechamento, dataFechamento, ...resto }) => ({
        ...resto,
        dataFechamento: `${dataFechamento}T${horarioFechamento}:00.000-03:00`,
      })),
  })
  .strict();

// Middleware de Cadastro
export const validarCadastroPlanoDeAula = async (req, res, next) => {
  try {
    converterCamposJSON(req.body, ["dadosPlanoDeAula"]);

    const dadosValidados = registroPlanoDeAulaSchema.parse(req.body);
    const { tipoConteudo } = dadosValidados.dadosPlanoDeAula;

    if (tipoConteudo === "anexo" && !req.file) {
      return res.status(400).json({
        erro: "Envie o arquivo do plano de aula quando o tipo for anexo.",
      });
    }

    if (tipoConteudo === "manual" && req.file) {
      await limparArquivoCloudinary(req.file);
      req.file = undefined;
    }

    req.body = dadosValidados;
    return next();
  } catch (error) {
    await limparArquivoCloudinary(req.file);
    return responderErroValidacao(res, error, "no cadastro do plano de aula");
  }
};