import mongoose from "mongoose";
import Turma from "../models/turma.model.js";
import Professor from "../models/professor.model.js";
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
  async listarTodas(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    const turmas = await Turma.find({
      professorId: id,
    });

    return turmas;
  }

  // 3. READ ONE
  async buscarPorId(id, turmaId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(turmaId)) {
      throw new AppError("ID da turma inválido.", 400);
    }

    try {
      const turma = await Turma.findOne({
        _id: turmaId,
        professorId: id,
      }).lean();

      if (!turma) {
        throw new AppError("Turma não encontrada.", 404);
      }

      const alunos = await Aluno.find({ turmaId })
        .select("nome urlFotoAluno hiperfoco")
        .lean();

      return { ...turma, alunos };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(`Erro ao buscar turma: ${error.message}`, 500);
    }
  }

  // 4. UPDATE
  // Permite alterar somente o nome da turma.
  async atualizar(id, { nome } = {}, acesso) {
    validarId(id);

    if (typeof nome !== "string" || !nome.trim()) {
      throw new AppError("O nome da turma é obrigatório.", 400);
    }

    const filtro = {
      _id: id,
      ...validarAcesso(acesso),
    };

    const turmaAtualizada = await Turma.findOneAndUpdate(
      filtro,
      { $set: { nome: nome.trim() } },
      { new: true, runValidators: true },
    ).populate("professorId", "nome sobrenome");

    if (!turmaAtualizada) {
      throw new AppError(
        "Turma não encontrada ou você não tem permissão para atualizá-la.",
        404,
      );
    }

    return turmaAtualizada;
  }

  // 5. DELETE
  // Exige confirmação explícita quando existem alunos vinculados.
  async deletar(id, acesso, { confirmarDesvinculacao = false } = {}) {
    validarId(id);

    const filtro = {
      _id: id,
      ...validarAcesso(acesso),
    };

    const turma = await Turma.findOne(filtro);

    if (!turma) {
      throw new AppError(
        "Turma não encontrada ou você não tem permissão para excluí-la.",
        404,
      );
    }

    const totalAlunos = await Aluno.countDocuments({
      turmaId: turma._id,
    });

    if (totalAlunos > 0 && !confirmarDesvinculacao) {
      throw new AppError(
        `Esta turma possui ${totalAlunos} aluno(s) vinculado(s). Confirme a desvinculação antes de excluí-la.`,
        409,
      );
    }

    if (totalAlunos > 0) {
      await Aluno.updateMany(
        { turmaId: turma._id },
        { $set: { turmaId: null } },
      );
    }

    await Turma.findByIdAndDelete(turma._id);

    return {
      mensagem:
        totalAlunos > 0
          ? "Turma excluída e alunos desvinculados com sucesso."
          : "Turma excluída com sucesso.",
      alunosDesvinculados: totalAlunos,
    };
  }
}

export default new TurmaService();
