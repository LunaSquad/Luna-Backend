import mongoose from "mongoose";

const hiperfocoSchema = mongoose.Schema(
  {
    hiperfoco: {
      type: String,
      trim: true,
      default: null,
    },
    urlFotoHiperfoco: {
      type: String,
      default: null,
    },
  },
  { _id: false },
);

const alunoSchema = mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "O aluno deve estar vinculado a um usuário"],
      index: true,
      unique: true
    },
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      default: null,
      index: true
    },
    nome: {
      type: String,
      required: [true, "O nome do aluno é obrigatório"],
      trim: true,
    },
    nomeResponsavel: {
      type: String,
      required: [true, "O nome do responsável é obrigatório"],
      trim: true,
    },
    cpf: {
      type: String,
      required: [true, "O CPF é obrigatório"],
      unique: true,
      trim: true,
    },
    cpfResponsavel: {
      type: String,
      required: [true, "O CPF do responsável é obrigatório"],
      trim: true,
    },
    dataNasc: {
      type: Date,
      required: [true, "A data de nascimento é obrigatória"],
    },
    telefone: {
      type: String,
      trim: true,
      match: [
        /^\d{10,11}$/,
        "O telefone deve conter entre 10 e 11 dígitos numéricos (apenas números, com DDD)"
      ],
      required: [true, "O telefone de contato é obrigatório"],
    },
    urlFotoAluno: {
      type: String,
      default: "https://caminho-para-imagem-padrao.com/foto.png",
    },
    urlFotoLaudo: {
      type: String,
      default: "https://caminho-para-imagem-padrao.com/foto.png",
    },
    hiperfoco: {
      type: hiperfocoSchema,
      default: null, // Por padrão é NULO, pois é cadastrado via Mobile
    },
  },
  { timestamps: true },
);

export default mongoose.model("Aluno", alunoSchema);
