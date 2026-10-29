import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "ID inválido (formato ObjectId esperado).");

export const nomeSchema = z
  .string()
  .trim()
  .min(3, "O nome deve ter no mínimo 3 caracteres.")
  .max(100, "O nome deve conter no máximo 100 caracteres.");

export const sobrenomeSchema = z
  .string()
  .trim()
  .min(3, "O sobrenome deve ter no mínimo 3 caracteres.")
  .max(100, "O sobrenome deve conter no máximo 100 caracteres.");

export const emailSchema = z
  .string()
  .trim()
  .max(255, "O e-mail deve ter no máximo 255 caracteres.")
  .pipe(z.email({ error: "Formato de e-mail inválido." }));

export const senhaSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .max(100, "A senha deve conter no máximo 100 caracteres.");

export const cpfSchema = z
  .string()
  .trim()
  .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números (sem pontos ou traços).");

export const telefoneSchema = z
  .string()
  .trim()
  .min(1, "O telefone é obrigatório.")
  .regex(/^\d{10,11}$/, "O telefone deve conter entre 10 e 11 números.",);

export const criarDataSchema = (nomeCampo = "data") =>
  z
    .string()
    .trim()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      `Informe a ${nomeCampo} no formato AAAA-MM-DD.`
    )
    .refine((valor) => {
      const data = new Date(`${valor}T00:00:00.000Z`);
      return (
        !Number.isNaN(data.getTime()) &&
        data.toISOString().slice(0, 10) === valor
      );
    }, `A ${nomeCampo} informada é inválida.`);

export const horarioSchema = z
  .string()
  .trim()
  .regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Informe o horário no formato HH:MM (ex: 18:00)."
  );

export const dataNascSchema = z.iso
  .datetime({ error: "A data de nascimento deve estar no formato ISO válido." })
  .refine(
    (data) => new Date(data) <= new Date(),
    "A data de nascimento não pode estar no futuro."
  );