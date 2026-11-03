import { Router } from "express";
import AtividadeController from "../controllers/atividade.controller.js";
import { validarCorrecaoAtividade } from "../middlewares/validacoes/validar-atividade.js";
import { auth } from "../middlewares/auth.js";
import { somenteProfessor } from "../middlewares/somente-professor.js";

const routes = Router();

// 1. Listar alunos e status de entrega de um plano de aula
routes.get(
  "/atividades/plano/:planoId",
  auth,
  somenteProfessor,
  AtividadeController.listarPorPlano
);

// 2. Buscar respostas e gabarito de um aluno para correção individual
routes.get(
  "/atividades/:id",
  auth,
  somenteProfessor,
  AtividadeController.buscarParaCorrecao
);

// 3. Registrar comentário (feedback) e concluir correção
routes.patch(
  "/atividades/:id/correcao",
  auth,
  somenteProfessor,
  validarCorrecaoAtividade,
  AtividadeController.corrigir
);

export default routes;
