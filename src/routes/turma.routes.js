import { Router } from "express";
import TurmaController from "../controllers/turma.controller.js";
import { validarCadastroTurma, validarUpdateTurma } from "../middlewares/validacoes/validar-turma.js";
import { auth } from "../middlewares/auth.js";

const routes = Router();

// 1. CREATE
routes.post("/turmas", auth, validarCadastroTurma, TurmaController.criar);

// 2. READ ALL
routes.get("/turmas", auth, TurmaController.listar);

// 3. READ ONE
routes.get("/turmas/:id", auth, TurmaController.buscarPorId);

// 4. UPDATE
routes.put("/turmas/:id", auth, validarUpdateTurma, TurmaController.atualizar);

// 5. DELETE
routes.delete("/turmas/:id", auth, TurmaController.deletar);

export default routes;