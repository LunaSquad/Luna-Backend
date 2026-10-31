import mongoose from "mongoose";

const planoDeAulaSchema = new mongoose.Schema(
  {
    materiaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materia",
      required: [true, "O plano de aula deve estar vinculado a uma matéria"],
      index: true,
    },
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      required: [true, "O plano de aula deve estar vinculado a uma turma"],
      index: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: [true, "O plano de aula deve estar vinculado a um professor"],
      index: true,
    },
    tipoConteudo: {
      type: String,
      enum: ["manual", "anexo"],
      required: true,
    },
    titulo: {
      type: String,
      trim: true,
      default: null,
    },
    descricao: {
      type: String,
      trim: true,
      default: null,
    },
    dataAula: {
      type: Date,
      required: [true, "A data da aula é obrigatória"],
    },
    dataFechamento: {
      type: Date,
      required: [true, "A data de fechamento da aula é obrigatória"],
    },
    urlPlanoDeAula: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlanoDeAula", planoDeAulaSchema, "planos_de_aula");
