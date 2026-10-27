import { Router } from "express";
import ProfessorController from "../controllers/professor.controller.js";
import { validarCadastroProfessor, validarUpdateProfessor } from "../middlewares/validacoes/validar-professor.js";
import { auth } from "../middlewares/auth.js";
import { somenteProfessor } from "../middlewares/somente-professor.js";
import { somenteAdmin } from "../middlewares/somente-admin.js";
import { uploadProfessor } from "../middlewares/upload-imagem.js";

const routes = Router();

// Cadastro
routes.post(
  "/professores",
  uploadProfessor.single("foto"),
  validarCadastroProfessor,
  ProfessorController.criar
);

// Listar todos — exclusivo ADM
routes.get(
  "/professores",
  auth,
  somenteAdmin,
  ProfessorController.listar
);

// Consultar perfil
routes.get(
  "/professores/perfil",
  auth,
  somenteProfessor,
  ProfessorController.buscarPerfil
);

// Atualizar perfil
routes.put(
  "/professores/perfil",
  auth,
  somenteProfessor,
  uploadProfessor.single("foto"),
  validarUpdateProfessor,
  ProfessorController.atualizarPerfil
);


// Excluir conta
routes.delete(
  "/professores/perfil",
  auth,
  somenteProfessor,
  ProfessorController.deletarPerfil
);

export default routes;