import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "O email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: true,
      select: false
    },
    tipoUser: {
      type: String,
      enum: ["professor", "aluno", "admin"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Usuario", usuarioSchema);
