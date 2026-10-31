import mongoose from "mongoose";
import Materia from "../models/materia.model.js";
import { AppError } from "../middlewares/helpers/app-error.js";

class MateriaService {
  // 1. READ ALL
  async listarTodas() {
    try {
      return await Materia.find().sort({ nome: 1 }).lean();
    } catch (error) {
      throw new AppError(`Erro ao listar matérias: ${error.message}`, 500);
    }
  }

  // 2. READ ONE
  async buscarPorId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID da matéria inválido.", 400);
    }

    try {
      const materia = await Materia.findById(id).lean();

      if (!materia) {
        throw new AppError("Matéria não encontrada.", 404);
      }

      return materia;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao buscar matéria: ${error.message}`, 500);
    }
  }
}

export default new MateriaService();