import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import dns from "dns";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import professorRoutes from "./routes/professor.routes.js";
import materiaRoutes from "./routes/materia.routes.js";
import turmaRoutes from "./routes/turma.routes.js";
import planoDeAulaRoutes from "./routes/plano-de-aula.routes.js";
import atividadeRoutes from "./routes/atividade.routes.js";
import healthRoutes from "./routes/health.routes.js";

const DB_Connection = process.env.DB_URL;

// Só força DNS público se estiver usando MongoDB Atlas (mongodb+srv)
if (DB_Connection && DB_Connection.startsWith("mongodb+srv://")) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const app = express();

app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API Web (Professor)
app.use("/", authRoutes);
app.use("/", professorRoutes);
app.use("/", materiaRoutes);
app.use("/", turmaRoutes);
app.use("/", planoDeAulaRoutes);
app.use("/", atividadeRoutes);
app.use("/", healthRoutes);

// Rota 404 padrão para endpoints inexistentes
app.use((req, res) => {
  return res.status(404).json({ erro: "Rota não encontrada." });
});

if (process.env.NODE_ENV !== "test") {
  const iniciarServidor = async () => {
    try {
      await mongoose.connect(DB_Connection);

      console.log("Conexão com o MongoDB estabelecida com sucesso!");

      const port = process.env.PORT || 4000;

      app.listen(port, () => {
        console.log(`API Rodando em http://localhost:${port}`);
        console.log(`Swagger Docs em http://localhost:${port}/api-docs`);
      });
    } catch (error) {
      console.error("Erro ao conectar ao MongoDB:", error);
      process.exit(1);
    }
  };

  iniciarServidor();
}

export default app;
