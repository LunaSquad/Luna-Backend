import swaggerJsdoc from "swagger-jsdoc";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docsPath = resolve(__dirname, "../docs/*.docs.js").replace(/\\/g, "/");

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Luna API",
      version: "1.0.0",
      description: "Documentação da API da plataforma educacional Luna.",
    },

    servers: [
      {
        url: "/",
        description: "Servidor atual da aplicação",
      },
    ],

    tags: [
      {
        name: "Autenticação",
        description: "Operações de autenticação.",
      },
      {
        name: "Professores",
        description: "Gerenciamento de professores.",
      },
      {
        name: "Matérias",
        description: "Consulta e gerenciamento de matérias.",
      },
      {
        name: "Turmas",
        description: "Gerenciamento de turmas.",
      },
      {
        name: "Planos de aula",
        description: "Gerenciamento de planos de aula.",
      },
      {
        name: "Atividades",
        description: "Gerenciamento de atividades.",
      },
      {
        name: "Health Check",
        description: "Verificação do estado da API.",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Informe o token JWT de autenticação.",
        },
      },
    },
  },

  apis: [docsPath],

  failOnErrors: true,
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
