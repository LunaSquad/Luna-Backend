import TurmaService from "../services/turma.service.js";

class TurmaController {
  // 1. CREATE (POST /turmas)
  async criar(req, res) {
    try {
      const novaTurma = await TurmaService.registrar(
        req.usuario.professorId,
        req.body
      );

      const linkConvite = `luna://app/convite?codigo=${novaTurma.codigoConvite}&turmaId=${novaTurma._id}`;

      return res.status(201).json({
        mensagem: "Turma registrada com sucesso!",
        turma: novaTurma,
        linkConvite,
      });
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 2. READ ALL (GET /turmas?formato=simples | completo)
  async listar(req, res) {
    try {
      const { formato = "completo" } = req.query;
      const turmas = await TurmaService.listarTodas(
        req.usuario.professorId,
        formato
      );
      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.statusCode
          ? error.message
          : "Erro interno ao listar as turmas.",
      });
    }
  }

  // 3. READ ONE (GET /turmas/:id)
  async buscarPorId(req, res) {
    try {
      const turma = await TurmaService.buscarPorId(
        req.params.id,
        req.usuario.professorId
      );
      return res.status(200).json(turma);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 4. UPDATE (PUT /turmas/:id)
  async atualizar(req, res) {
    try {
      const turmaAtualizada = await TurmaService.atualizar(
        req.params.id,
        req.usuario.professorId,
        req.body
      );
      return res.status(200).json(turmaAtualizada);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 5. DELETE (DELETE /turmas/:id)
  async deletar(req, res) {
    try {
      const resultado = await TurmaService.deletar(
        req.params.id,
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

export default new TurmaController();