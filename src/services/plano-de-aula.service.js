import mongoose from "mongoose";
import PlanoDeAula from "../models/plano-de-aula.model.js";
import Turma from "../models/turma.model.js";
import Materia from "../models/materia.model.js";
import { AppError } from "../middlewares/helpers/app-error.js";
import { limparArquivoCloudinary } from "../middlewares/helpers/limpar-cloudinary.js";

class PlanoDeAulaService {
  // CREATE
  async criar(professorId, { dadosPlanoDeAula } = {}, file) {
    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      await limparArquivoCloudinary(file);
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const [turmaExiste, materiaExiste] = await Promise.all([
        Turma.exists({ _id: dadosPlanoDeAula.turmaId, professorId }),
        Materia.exists({ _id: dadosPlanoDeAula.materiaId }),
      ]);

      if (!turmaExiste) {
        throw new AppError(
          "Turma não encontrada ou não pertence a este professor.",
          404
        );
      }

      if (!materiaExiste) {
        throw new AppError("Matéria não encontrada.", 404);
      }

      const ehAnexo = dadosPlanoDeAula.tipoConteudo === "anexo";
      const urlPlanoDeAula = ehAnexo && file ? file.path : null;

      // Quando for anexo e não enviar título, usa o nome do arquivo sem a extensão
      const nomeArquivoSemExtensao = file?.originalname
        ? file.originalname.replace(/\.[^/.]+$/, "")
        : "Plano de Aula (Anexo)";

      const tituloFinal = ehAnexo
        ? dadosPlanoDeAula.titulo ?? nomeArquivoSemExtensao
        : dadosPlanoDeAula.titulo;

      const novoPlano = await PlanoDeAula.create({
        ...dadosPlanoDeAula,
        titulo: tituloFinal,
        descricao: ehAnexo
          ? dadosPlanoDeAula.descricao ?? null
          : dadosPlanoDeAula.descricao,
        professorId,
        urlPlanoDeAula,
      });

      return novoPlano;
    } catch (error) {
      await limparArquivoCloudinary(file);

      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao criar plano de aula: ${error.message}`, 500);
    }
  }
}

export default new PlanoDeAulaService();