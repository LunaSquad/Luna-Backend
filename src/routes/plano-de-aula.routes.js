import { Router } from "express";
import PlanoDeAulaController from "../controllers/plano-de-aula.controller.js";
import { auth } from "../middlewares/auth.js";
import { validarCadastroPlanoDeAula, validarUpdatePlanoDeAula } from "../middlewares/validacoes/validar-plano-de-aula.js";
import { uploadPlanoDeAula } from "../middlewares/upload-imagem.js";

const routes = Router();

routes.post("/planos-de-aula", auth, uploadPlanoDeAula.single('arquivo'), validarCadastroPlanoDeAula, PlanoDeAulaController.criar);
routes.get("/planos-de-aula", auth, PlanoDeAulaController.listar);
routes.get("/planos-de-aula/:id", auth, PlanoDeAulaController.buscarPorId);
routes.put("/planos-de-aula/:id", auth, uploadPlanoDeAula.single('arquivo'), validarUpdatePlanoDeAula, PlanoDeAulaController.atualizar);
routes.delete("/planos-de-aula/:id", auth, PlanoDeAulaController.deletar);

export default routes;