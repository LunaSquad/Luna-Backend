import mongoose from "mongoose";

const turmaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome da turma é obrigatório"],
      trim: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    codigoConvite: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 8).toUpperCase()
    },
  },
  { timestamps: true }
);

export default mongoose.model("Turma", turmaSchema);