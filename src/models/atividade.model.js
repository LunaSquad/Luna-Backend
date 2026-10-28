import mongoose from "mongoose";

// Sub-schema para cada questão
const questaoSchema = new mongoose.Schema(
  {
    pergunta: {
      type: String,
      required: [true, "A pergunta da questão é obrigatória"],
      trim: true,
    },
    respostaCorreta: {
      type: String,
      required: [true, "A resposta correta é obrigatória"],
      trim: true,
    },
    alternativas: {
      type: [String],
      default: [],
    },
    respostaAluno: {
      type: String,
      default: null,
      trim: true,
    },
  },
);

// Sub-schema para cada atividade (Atividade 1, Atividade 2...)
const itemAtividadeSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "O título do bloco de atividade é obrigatório"],
      trim: true,
    },
    conteudoAdaptado: {
      type: String,
      required: [true, "O conteúdo adaptado é obrigatório"],
      trim: true,
    },
    questoes: {
      type: [questaoSchema],
      default: [],
    },
  },
);

// Atividade
const atividadeSchema = new mongoose.Schema(
  {
    alunoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aluno",
      required: [true, "A atividade deve estar vinculada a um aluno"],
      index: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: [true, "A atividade deve estar vinculada a um professor"],
      index: true,
    },
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      required: [true, "A atividade deve estar vinculada a uma turma"],
      index: true,
    },
    materiaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materia",
      required: [true, "A atividade deve estar vinculada a uma matéria"],
      index: true,
    },
    planoDeAulaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanoDeAula",
      required: [true, "A atividade deve estar vinculada a um plano de aula"],
      index: true,
    },
    titulo: {
      type: String,
      required: [true, "O título da atividade é obrigatório"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pendente", "entregue", "corrigida"],
      default: "pendente",
      required: true,
    },
    dataFechamento: {
      type: Date,
      required: [true, "A data de fechamento da atividade é obrigatória"],
    },
    dataEntrega: {
      type: Date,
      default: null, // Preenchido quando o aluno envia pelo app mobile
    },
    atividades: {
      type: [itemAtividadeSchema],
      required: [true, "A lista de atividades geradas é obrigatória"],
      default: [],
    },
  },
  { timestamps: true },
);

// O aluno só pode ter uma atividade por plano de aula
atividadeSchema.index({ alunoId: 1, planoDeAulaId: 1 }, { unique: true });

export default mongoose.model("Atividade", atividadeSchema, "atividades");
