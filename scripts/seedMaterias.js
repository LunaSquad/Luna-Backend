import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Materia from "../src/models/materia.model.js";

dotenv.config();

// Só configura DNS externo se a URL for SRV (MongoDB Atlas)
if (process.env.DB_URL && process.env.DB_URL.startsWith("mongodb+srv://")) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}
// ... restante do seu código permanece idêntico

// Configs
dotenv.config();

// Lista de Matérias do Sistema
const materiasBasicas = [
  { nome: "Língua Portuguesa" },
  { nome: "Matemática" },
  { nome: "História" },
  { nome: "Geografia" },
  { nome: "Ciências" },
];

async function executarSeed() {
  try {
    if (!process.env.DB_URL) {
      throw new Error("A variável DB_URL não está definida no arquivo .env");
    }

    // 1. Conexão com o Banco de Dados
    await mongoose.connect(process.env.DB_URL);
    console.log("Conectado ao MongoDB...");

    // 2. Insere apenas as matérias que ainda não existem (evita duplicatas)
    const operacoes = materiasBasicas.map((materia) => ({
      updateOne: {
        filter: { nome: materia.nome },
        update: { $setOnInsert: { nome: materia.nome } },
        upsert: true,
      },
    }));

    const resultado = await Materia.bulkWrite(operacoes);

    if (resultado.upsertedCount > 0) {
      console.log(
        `Seed concluído: ${resultado.upsertedCount} matéria(s) inserida(s) com sucesso!`
      );
    } else {
      console.log("Todas as matérias básicas já estavam cadastradas.");
    }

    // 3. Desconecta e encerra o Seed com segurança
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Erro ao executar o seed:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

// Roda o Seed
executarSeed();
