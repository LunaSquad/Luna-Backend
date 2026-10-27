import ProfessorService from "../services/professor.service.js";

class ProfessorController {
  // 1. CREATE
  async criar(req, res) {
    try {
      const novoProfessor = await ProfessorService.registrar(
        req.body,
        req.file
      );

      return res.status(201).json({
        mensagem: "Professor cadastrado com sucesso!",
        professor: novoProfessor,
      });
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 2. READ ALL — ADMIN
  async listar(req, res) {
    try {
      const professores = await ProfessorService.listarTodos();

      return res.status(200).json(professores);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.statusCode
          ? error.message
          : "Erro interno ao listar os professores.",
      });
    }
  }

  // 3. READ ONE
  async buscarPerfil(req, res) {
    try {
      const professor = await ProfessorService.buscarPorId(
        req.usuario.professorId
      );

      return res.status(200).json(professor);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 4. UPDATE
  async atualizarPerfil(req, res) {
    try {
      const professorAtualizado = await ProfessorService.atualizar(
        req.usuario.professorId,
        req.body,
        req.file
      );

      return res.status(200).json({
        mensagem: "Perfil atualizado com sucesso!",
        professor: professorAtualizado,
      });
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 5. DELETE
  async deletarPerfil(req, res) {
    try {
      const resultado = await ProfessorService.deletar(
        req.usuario.professorId
      );

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }
}

export default new ProfessorController();