import mongoose from "mongoose";
import Atividade from "../models/atividade.model.js";
import PlanoDeAula from "../models/plano-de-aula.model.js";
import Turma from "../models/turma.model.js";
import Aluno from "../models/aluno.model.js";
import { AppError } from "../middlewares/helpers/app-error.js";

class AtividadeService {
  // 1. LISTAR ALUNOS E STATUS DAS ATIVIDADES POR PLANO DE AULA
  async listarPorPlano(planoId, professorId) {
    if (!mongoose.Types.ObjectId.isValid(planoId)) {
      throw new AppError("ID do plano de aula inválido.", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const plano = await PlanoDeAula.findOne({
        _id: planoId,
        professorId,
      })
        .populate("materiaId", "nome")
        .lean();

      if (!plano) {
        throw new AppError(
          "Plano de aula não encontrado ou não pertence a este professor.",
          404
        );
      }

      const planoIdStr = String(plano._id);

      const [alunosDaTurma, registrosAtividade] = await Promise.all([
        Aluno.find({ turmaId: plano.turmaId })
          .select("_id usuarioId nome cpf urlFotoAluno")
          .lean(),
        Atividade.find({
          $or: [{ planoID: planoIdStr }, { planoOrigemID: planoIdStr }],
        }).lean(),
      ]);

      let corrigidas = 0;
      let pendentes = 0;

      const alunos = alunosDaTurma.map((aluno) => {
        const alunoIdStr = String(aluno._id);
        const usuarioIdStr = String(aluno.usuarioId);

        const entrega = registrosAtividade.find(
          (reg) =>
            (String(reg.alunoID) === alunoIdStr ||
              String(reg.alunoID) === usuarioIdStr) &&
            Array.isArray(reg.respostas) &&
            reg.respostas.length > 0
        );

        let status = "Pendente";
        let atividadeId = null;

        if (entrega) {
          atividadeId = entrega._id;
          if (entrega.status === "corrigida") {
            status = "Corrigido";
            corrigidas++;
          } else {
            // "concluida" ou "entregue" no banco vira "Entregue" na tela para o professor corrigir
            status = "Entregue";
            pendentes++;
          }
        } else {
          pendentes++;
        }

        return {
          _id: aluno._id,
          nome: aluno.nome,
          cpf: aluno.cpf,
          urlFotoAluno: aluno.urlFotoAluno,
          status,
          atividadeId,
        };
      });

      return {
        plano: {
          _id: plano._id,
          titulo: plano.titulo,
          descricao: plano.descricao,
          materia: plano.materiaId?.nome ?? null,
          dataAula: plano.dataAula,
          dataFechamento: plano.dataFechamento,
        },
        resumo: {
          corrigidas,
          pendentes,
          total: alunosDaTurma.length,
        },
        alunos,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Erro ao listar atividades do plano: ${error.message}`,
        500
      );
    }
  }

  // 2. BUSCAR RESPOSTAS DE UM ALUNO PARA CORREÇÃO INDIVIDUAL
  async buscarParaCorrecao(atividadeId, professorId) {
    if (!mongoose.Types.ObjectId.isValid(atividadeId)) {
      throw new AppError("ID da atividade inválido.", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const atividade = await Atividade.findById(atividadeId).lean();

      if (!atividade) {
        throw new AppError("Atividade não encontrada.", 404);
      }

      if (
        !Array.isArray(atividade.respostas) ||
        atividade.respostas.length === 0
      ) {
        throw new AppError(
          "Esta atividade ainda não possui respostas entregues pelo aluno.",
          400
        );
      }

      // Garante que a turma da atividade pertence ao professor logado
      const turmaDoProfessor = await Turma.exists({
        _id: atividade.turmaID,
        professorId,
      });

      if (!turmaDoProfessor) {
        throw new AppError(
          "Você não tem permissão para acessar esta atividade.",
          403
        );
      }

      const aluno = mongoose.Types.ObjectId.isValid(atividade.alunoID)
        ? await Aluno.findOne({
            $or: [{ _id: atividade.alunoID }, { usuarioId: atividade.alunoID }],
          })
            .select("_id usuarioId nome urlFotoAluno")
            .lean()
        : null;

      const totalQuestoes =
        atividade.totalQuestoes || atividade.respostas.length;
      const acertos =
        atividade.acertos ??
        atividade.respostas.filter((r) => r.acertou).length;

      const aproveitamento =
        totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;

      const questoes = atividade.respostas.map((item, index) => ({
        _id: `${atividade._id}_q${item.numeroQuestao ?? index + 1}`,
        numero: item.numeroQuestao ?? index + 1,
        enunciado: item.pergunta,
        respostaAluno: item.respostaAluno,
        respostaCorreta: item.respostaCorreta,
        correta: Boolean(item.acertou),
      }));

      return {
        _id: atividade._id,
        planoId: atividade.planoID || atividade.planoOrigemID,
        turmaId: atividade.turmaID,
        alunoId: aluno?._id?.toString() ?? null,
        usuarioId: atividade.alunoID?.toString() ?? null,
        nome: aluno?.nome ?? "Aluno",
        avatarUrl: aluno?.urlFotoAluno ?? "",
        titulo: atividade.titulo || atividade.tituloAdaptado,
        status: atividade.status,
        acertos,
        totalQuestoes,
        aproveitamento,
        comentarioProfessor: atividade.comentarioProfessor ?? "",
        questoes,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Erro ao buscar atividade para correção: ${error.message}`,
        500
      );
    }
  }

  // 3. REGISTRAR COMENTÁRIO E CONCLUIR CORREÇÃO
  async corrigir(atividadeId, professorId, { comentarioProfessor }) {
    if (!mongoose.Types.ObjectId.isValid(atividadeId)) {
      throw new AppError("ID da atividade inválido.", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const atividade = await Atividade.findById(atividadeId);

      if (!atividade) {
        throw new AppError("Atividade não encontrada.", 404);
      }

      if (
        !Array.isArray(atividade.respostas) ||
        atividade.respostas.length === 0
      ) {
        throw new AppError(
          "Não é possível corrigir uma atividade que ainda não foi respondida pelo aluno.",
          400
        );
      }

      const turmaDoProfessor = await Turma.exists({
        _id: atividade.turmaID,
        professorId,
      });

      if (!turmaDoProfessor) {
        throw new AppError(
          "Você não tem permissão para corrigir esta atividade.",
          403
        );
      }

      atividade.comentarioProfessor = comentarioProfessor;
      atividade.status = "corrigida";
      atividade.dataCorrecao = new Date();

      await atividade.save();

      return {
        mensagem: "Feedback enviado e atividade corrigida com sucesso.",
        atividadeId: atividade._id,
        status: atividade.status,
        comentarioProfessor: atividade.comentarioProfessor,
        dataCorrecao: atividade.dataCorrecao,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Erro ao salvar correção da atividade: ${error.message}`,
        500
      );
    }
  }
}

export default new AtividadeService();
