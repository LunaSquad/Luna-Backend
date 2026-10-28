import { Router } from "express";
import TurmaController from "../controllers/turma.controller.js";
import {
  validarCadastroTurma,
  validarUpdateTurma,
} from "../middlewares/validacoes/validar-turma.js";
import { auth } from "../middlewares/auth.js";
import { somenteProfessor } from "../middlewares/somente-professor.js";

const routes = Router();

// 1. CREATE
routes.post(
  "/turmas",
  auth,
  somenteProfessor,
  validarCadastroTurma,
  TurmaController.criar
);

// 2. READ ALL
routes.get("/turmas", auth, somenteProfessor, TurmaController.listar);

// 3. READ ONE
routes.get("/turmas/:id", auth, somenteProfessor, TurmaController.buscarPorId);

// 4. UPDATE
routes.put(
  "/turmas/:id",
  auth,
  somenteProfessor,
  validarUpdateTurma,
  TurmaController.atualizar
);

// 5. DELETE
routes.delete("/turmas/:id", auth, somenteProfessor, TurmaController.deletar);

export default routes;