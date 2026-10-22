import mongoose from "mongoose";

const atividadeSchema = new mongoose.Schema(
  {
    planoDeAulaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanoDeAula",
      required: [true, "A atividade deve estar vinculada a um plano de aula"],
      index: true,
    },
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
    materiaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materia",
      required: [true, "A atividade deve estar vinculada a uma matéria"],
      index: true,
    },
    hiperfoco: {
      type: String,
      required: [true, "O título da atividade é obrigatório"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pendente", "entregue", "corrigida", "atrasada"],
      required: true,
    },
    dataFinal: {
      type: Date,
      required: [true, "A data final da atividade é obrigatória"],
    },
    urlAtividade: {
      type: String,
      default: "https://caminho-para-atividade-padrao.com/atv.pdf",
    },
    respostasAluno: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Atividade", atividadeSchema);
