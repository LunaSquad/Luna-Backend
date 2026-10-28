import MateriaService from "../services/materia.service.js";

class MateriaController {
  // 1. READ ALL (GET /materias)
  async listar(req, res) {
    try {
      const materias = await MateriaService.listarTodas();
      return res.status(200).json(materias);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.statusCode
          ? error.message
          : "Erro interno ao listar as matérias.",
      });
    }
  }

  // 2. READ ONE (GET /materias/:id)
  async buscarPorId(req, res) {
    try {
      const materia = await MateriaService.buscarPorId(req.params.id);
      return res.status(200).json(materia);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }
}

export default new MateriaController();