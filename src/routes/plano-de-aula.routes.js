import { Router } from "express";
import PlanoDeAulaController from "../controllers/plano-de-aula.controller.js";
import { auth } from "../middlewares/auth.js";
import { somenteProfessor } from "../middlewares/somente-professor.js";
import { validarCadastroPlanoDeAula } from "../middlewares/validacoes/validar-plano-de-aula.js";
import { uploadPlanoDeAula } from "../middlewares/upload-imagem.js";

const routes = Router();

// CREATE (POST /planos-de-aula)
routes.post(
  "/planos-de-aula",
  auth,
  somenteProfessor,
  uploadPlanoDeAula.single("arquivo"),
  validarCadastroPlanoDeAula,
  PlanoDeAulaController.criar
);

export default routes;