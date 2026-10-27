import { Router } from "express";
import AlunoController from "../controllers/aluno.controller.js";
import { validarCadastroAluno, validarUpdateAluno } from "../middlewares/validacoes/validar-aluno.js";
import { auth } from "../middlewares/auth.js";
import { uploadAluno } from "../middlewares/upload-imagem.js";

const routes = Router();

const processarArquivosAluno = uploadAluno.fields([
  { name: 'foto', maxCount: 1 }, 
  { name: 'laudo', maxCount: 1 }
]);

// 1. CREATE
routes.post("/alunos", auth, processarArquivosAluno, validarCadastroAluno, AlunoController.criar);

// 2. READ ALL
routes.get("/alunos", auth, AlunoController.listar);

// 3. READ ONE
routes.get("/alunos/:id", auth, AlunoController.buscarPorId);
  
// 4. UPDATE
routes.put("/alunos/:id", auth, processarArquivosAluno, validarUpdateAluno, AlunoController.atualizar);

// 5. DELETE
routes.delete("/alunos/:id", auth, AlunoController.deletar);

export default routes;