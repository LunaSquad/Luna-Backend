import PlanoDeAulaService from "../services/plano-de-aula.service.js";

class PlanoDeAulaController {
  // CREATE (POST /planos-de-aula)
  async criar(req, res) {
    try {
      const novoPlano = await PlanoDeAulaService.criar(
        req.usuario.professorId,
        req.body,
        req.file
      );

      return res.status(201).json({
        mensagem: "Plano de aula criado com sucesso!",
        plano: novoPlano,
      });
    } catch (error) {
      return res.status(error.statusCode ?? 500).json({
        erro: error.message,
      });
    }
  }
}

export default new PlanoDeAulaController();