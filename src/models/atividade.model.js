import mongoose from "mongoose";

// Sub-schema para os tópicos da explicação teórica (gerado pela IA)
const topicoExplicacaoSchema = new mongoose.Schema(
  {
    subtitulo: { type: String, trim: true, default: null },
    textoAdaptado: { type: String, trim: true, default: null },
    dicaVisual: { type: String, trim: true, default: null },
  },
  { _id: false },
);

// Sub-schema para os tópicos de exemplo prático (gerado pela IA)
const topicoExemploSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true, default: null },
    passoAPasso: { type: String, trim: true, default: null },
    conclusao: { type: String, trim: true, default: null },
  },
  { _id: false },
);

// Sub-schema para cada questão dentro de uma missão (gerado pela IA)
const questaoSchema = new mongoose.Schema(
  {
    tituloAtividade: { type: String, trim: true, default: null },
    comandoAtividade: { type: String, trim: true, default: null },
    tipo: { type: String, trim: true, default: "objetiva" },
    pergunta: {
      type: String,
      required: [true, "A pergunta da questão é obrigatória"],
      trim: true,
    },
    dicaTDAH: { type: String, trim: true, default: null },
    respostaCorreta: {
      type: String,
      required: [true, "A resposta correta é obrigatória"],
      trim: true,
    },
    alternativas: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

// Sub-schema para cada missão (Missão 1, Missão 2...)
const itemAtividadeSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "O título da missão é obrigatório"],
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
  { _id: false },
);

// Sub-schema para cada resposta enviada pelo aluno no mobile
const respostaAlunoItemSchema = new mongoose.Schema(
  {
    numeroQuestao: { type: Number, required: true },
    pergunta: { type: String, required: true, trim: true },
    respostaAluno: { type: String, required: true, trim: true },
    respostaCorreta: { type: String, required: true, trim: true },
    acertou: { type: Boolean, required: true },
    tipo: { type: String, trim: true, default: "objetiva" },
  },
  { _id: false },
);

// Schema principal da collection "atividades"
const atividadeSchema = new mongoose.Schema(
  {
    // Identificadores (salvos como String pelo mobile)
    planoOrigemID: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    planoID: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    alunoID: {
      type: String,
      required: [true, "O ID do aluno (alunoID) é obrigatório"],
      trim: true,
      index: true,
    },
    turmaID: {
      type: String,
      required: [true, "O ID da turma (turmaID) é obrigatório"],
      trim: true,
      index: true,
    },
    materiaID: {
      type: String,
      required: [true, "O ID da matéria (materiaID) é obrigatório"],
      trim: true,
      index: true,
    },

    // Campos do documento gerado pela IA
    hiperfoco: { type: String, trim: true, default: null },
    moldeUsado: { type: String, trim: true, default: null },
    temaDetectado: { type: String, trim: true, default: null },
    urlPlanoOriginal: { type: String, trim: true, default: null },
    assetsVisuais: { type: [String], default: [] },
    versaoCache: { type: String, trim: true, default: null },
    tituloAdaptado: { type: String, trim: true, default: null },
    temaOriginal: { type: String, trim: true, default: null },
    disciplina: { type: String, trim: true, default: null },
    explicacaoTeorica: { type: String, trim: true, default: null },
    topicosExplicacao: { type: [topicoExplicacaoSchema], default: [] },
    temExemplo: { type: Boolean, default: false },
    exemploPratico: { type: String, trim: true, default: null },
    topicosExemplo: { type: [topicoExemploSchema], default: [] },
    atividades: { type: [itemAtividadeSchema], default: [] },
    explicacaoAdaptada: { type: String, trim: true, default: null },

    // Campos do documento de resposta do aluno (Mobile) e correção (Web)
    titulo: { type: String, trim: true, default: null },
    materia: { type: String, trim: true, default: null },
    acertos: { type: Number, default: 0 },
    totalQuestoes: { type: Number, default: 0 },
    respostas: { type: [respostaAlunoItemSchema], default: [] },
    status: {
      type: String,
      enum: ["pendente", "concluida", "entregue", "corrigida"],
      default: "pendente",
    },
    comentarioProfessor: {
      type: String,
      trim: true,
      default: "",
    },
    dataCorrecao: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Atividade", atividadeSchema, "atividades");