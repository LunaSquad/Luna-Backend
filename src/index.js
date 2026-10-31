import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

import authRoutes from "./routes/auth.routes.js";
import professorRoutes from "./routes/professor.routes.js";
import materiaRoutes from "./routes/materia.routes.js";
import turmaRoutes from "./routes/turma.routes.js";
import planoDeAulaRoutes from "./routes/plano-de-aula.routes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API Web (Professor)
app.use("/", authRoutes);
app.use("/", professorRoutes);
app.use("/", materiaRoutes);
app.use("/", turmaRoutes);
app.use("/", planoDeAulaRoutes);

// Rota 404 padrão para endpoints inexistentes
app.use((req, res) => {
  return res.status(404).json({ erro: "Rota não encontrada." });
});

const DB_Connection = process.env.DB_URL;

mongoose
  .connect(DB_Connection)
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

const port = process.env.PORT || 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`API Rodando em http://localhost:${port}`);
  }
});