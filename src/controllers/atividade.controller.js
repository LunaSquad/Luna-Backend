import AtividadeService from "../services/atividade.service.js";

class AtividadeController {
  // 1. LISTAR ALUNOS E STATUS POR PLANO DE AULA (GET /atividades/plano/:planoId)
  async listarPorPlano(req, res) {
    try {
      const resultado = await AtividadeService.listarPorPlano(
        req.params.planoId,
        req.usuario.professorId
      );

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 2. BUSCAR RESPOSTAS DE UM ALUNO PARA CORREÇÃO (GET /atividades/:id)
  async buscarParaCorrecao(req, res) {
    try {
      const atividade = await AtividadeService.buscarParaCorrecao(
        req.params.id,
        req.usuario.professorId
      );

      return res.status(200).json(atividade);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }

  // 3. REGISTRAR COMENTÁRIO E CONCLUIR CORREÇÃO (PATCH /atividades/:id/correcao)
  async corrigir(req, res) {
    try {
      const resultado = await AtividadeService.corrigir(
        req.params.id,
        req.usuario.professorId,
        req.body
      );

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }
}

export default new AtividadeController();