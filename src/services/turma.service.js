import mongoose from "mongoose";
import Turma from "../models/turma.model.js";
import PlanoDeAula from "../models/plano-de-aula.model.js";
import Atividade from "../models/atividade.model.js";
import Aluno from "../models/aluno.model.js";
import { AppError } from "../middlewares/helpers/app-error.js";

class TurmaService {
  // 1. CREATE
  async registrar(id, { dadosTurma } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const nomeEmUso = await Turma.exists({
        nome: dadosTurma.nome,
        professorId: id,
      });

      if (nomeEmUso) {
        throw new AppError("Este nome já está em uso", 409);
      }

      const novaTurma = await Turma.create({
        nome: dadosTurma.nome,
        professorId: id,
      });

      return novaTurma;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao registrar turma : ${error.message}`, 400);
    }
  }

  // 2. READ ALL
  async listarTodas(id, formato = "completo") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      if (formato === "simples") {
        const turmasSimples = await Turma.find({ professorId: id })
          .select("_id nome")
          .lean();

        return turmasSimples;
      }

      const turmas = await Turma.find({ professorId: id }).lean();

      const turmasCompletas = await Promise.all(
        turmas.map(async (turma) => {
          const [quantidadeAlunos, planosDaTurma, entregasDaTurma] =
            await Promise.all([
              Aluno.countDocuments({ turmaId: turma._id }),
              PlanoDeAula.find({ turmaId: turma._id, professorId: id })
                .select("_id")
                .lean(),
              Atividade.find({
                turmaID: String(turma._id),
                "respostas.0": { $exists: true },
              })
                .select("planoID planoOrigemID alunoID status")
                .lean(),
            ]);

          const totalAtividades = planosDaTurma.length;
          let pendentes = 0;

          for (const plano of planosDaTurma) {
            const entregasDoPlano = entregasDaTurma.filter(
              (ativ) =>
                String(ativ.planoID || ativ.planoOrigemID) === String(plano._id),
            );

            const todosCorrigidos =
              quantidadeAlunos > 0 &&
              entregasDoPlano.length >= quantidadeAlunos &&
              entregasDoPlano.every((ativ) => ativ.status === "corrigida");

            if (!todosCorrigidos) {
              pendentes++;
            }
          }

          const feitas = totalAtividades - pendentes;

          const progresso =
            totalAtividades > 0
              ? Math.round((feitas / totalAtividades) * 100)
              : 0;

          return {
            ...turma,
            quantidadeAlunos,
            atividades: {
              total: totalAtividades,
              feitas,
              pendentes,
              progresso,
            },
          };
        }),
      );

      return turmasCompletas;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao listar turmas: ${error.message}`, 500);
    }
  }

  // 3. READ ONE
  async buscarPorId(turmaId, professorId) {
    if (!mongoose.Types.ObjectId.isValid(turmaId)) {
      throw new AppError("ID da turma inválido.", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const turma = await Turma.findOne({
        _id: turmaId,
        professorId,
      }).lean();

      if (!turma) {
        throw new AppError("Turma não encontrada.", 404);
      }

      const [alunos, planosDeAula, entregasDaTurma] = await Promise.all([
        Aluno.find({ turmaId })
          .select("_id usuarioId nome cpf urlFotoAluno hiperfoco")
          .lean(),
        PlanoDeAula.find({ turmaId, professorId })
          .populate("materiaId", "nome")
          .sort({ dataAula: -1 })
          .lean(),
        Atividade.find({
          turmaID: String(turmaId),
          "respostas.0": { $exists: true },
        })
          .select("alunoID planoID planoOrigemID status acertos totalQuestoes")
          .lean(),
      ]);

      const alunosComDesempenho = alunos.map((aluno) => {
        const entregasDoAluno = entregasDaTurma.filter(
          (ativ) =>
            String(ativ.alunoID) === String(aluno._id) ||
            String(ativ.alunoID) === String(aluno.usuarioId),
        );

        const totalQuestoesRespondidas = entregasDoAluno.reduce(
          (acc, ativ) => acc + (ativ.totalQuestoes || 0),
          0,
        );
        const totalAcertos = entregasDoAluno.reduce(
          (acc, ativ) => acc + (ativ.acertos || 0),
          0,
        );

        const desempenho =
          totalQuestoesRespondidas > 0
            ? Math.round((totalAcertos / totalQuestoesRespondidas) * 100)
            : 0;

        let situacao = "Sem atividades";
        if (entregasDoAluno.length > 0) {
          if (desempenho >= 80) {
            situacao = "Excelente";
          } else if (desempenho >= 50) {
            situacao = "Bom";
          } else {
            situacao = "Atenção";
          }
        }

        return {
          ...aluno,
          desempenho,
          situacao,
        };
      });

      let planosPendentes = 0;

      const planosComStatus = planosDeAula.map((plano) => {
        const entregasDoPlano = entregasDaTurma.filter(
          (ativ) =>
            String(ativ.planoID || ativ.planoOrigemID) === String(plano._id),
        );

        const todosCorrigidos =
          alunos.length > 0 &&
          entregasDoPlano.length >= alunos.length &&
          entregasDoPlano.every((ativ) => ativ.status === "corrigida");

        if (!todosCorrigidos) {
          planosPendentes++;
        }

        return {
          ...plano,
          statusTurma: todosCorrigidos ? "concluida" : "pendente",
        };
      });

      return {
        ...turma,
        linkConvite: `luna://app/convite?codigo=${turma.codigoConvite}&turmaId=${turma._id}`,
        resumo: {
          totalAlunos: alunos.length,
          totalAtividades: planosDeAula.length,
          pendentes: planosPendentes,
        },
        alunos: alunosComDesempenho,
        atividades: planosComStatus,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao buscar turma: ${error.message}`, 500);
    }
  }

  // 4. UPDATE
  async atualizar(turmaId, professorId, { dadosTurma } = {}) {
    if (!mongoose.Types.ObjectId.isValid(turmaId)) {
      throw new AppError("ID da turma inválido.", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const nomeEmUso = await Turma.exists({
        nome: dadosTurma.nome,
        professorId,
        _id: { $ne: turmaId },
      });

      if (nomeEmUso) {
        throw new AppError("Você já possui outra turma com este nome.", 409);
      }

      const turmaAtualizada = await Turma.findOneAndUpdate(
        { _id: turmaId, professorId },
        { $set: { nome: dadosTurma.nome } },
        { new: true, runValidators: true },
      );

      if (!turmaAtualizada) {
        throw new AppError("Turma não encontrada.", 404);
      }

      return turmaAtualizada;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao atualizar turma: ${error.message}`, 500);
    }
  }

  // 5. DELETE
  async deletar(turmaId, professorId) {
    if (!mongoose.Types.ObjectId.isValid(turmaId)) {
      throw new AppError("ID da turma inválido.", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    try {
      const turma = await Turma.findOne({ _id: turmaId, professorId });

      if (!turma) {
        throw new AppError("Turma não encontrada.", 404);
      }

      const planosComAnexo = await PlanoDeAula.find({
        turmaId,
        tipoConteudo: "anexo",
        urlPlanoDeAula: { $ne: null },
      })
        .select("urlPlanoDeAula")
        .lean();

      await Promise.all([
        Aluno.updateMany({ turmaId }, { $set: { turmaId: null } }),
        Atividade.deleteMany({ turmaId: String(turmaId) }),
        PlanoDeAula.deleteMany({ turmaId }),
        Turma.deleteOne({ _id: turmaId, professorId }),
      ]);

      return { mensagem: "Turma excluída e alunos desvinculados com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao deletar turma: ${error.message}`, 500);
    }
  }
}

export default new TurmaService();
