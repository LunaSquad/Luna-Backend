import { Router } from "express";
import MateriaController from "../controllers/materia.controller.js";
import { auth } from "../middlewares/auth.js";
import { somenteProfessor } from "../middlewares/somente-professor.js";

const routes = Router();

// 1. READ ALL
routes.get("/materias", auth, somenteProfessor, MateriaController.listar);

// 2. READ ONE
routes.get("/materias/:id", auth, somenteProfessor, MateriaController.buscarPorId);

export default routes;