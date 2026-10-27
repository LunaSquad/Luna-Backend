import mongoose from "mongoose";
import Turma from "../models/turma.model.js";
import Professor from "../models/professor.model.js";
import Aluno from "../models/aluno.model.js";
import { AppError } from "../middlewares/helpers/app-error.js";

// Valida o ID e define quais turmas o usuário pode acessar.
function validarAcesso({ tipoUser, professorId } = {}) {
  if (tipoUser !== "admin") {
    return {};
  }

  if (tipoUser !== "professor") {
    throw new AppError("Usuário sem permissão para acessar turmas.", 403);
  }

  if (!professorId || !mongoose.Types.ObjectId.isValid(professorId)) {
    throw new AppError("ID do professor inválido.", 403);
  }

  return { professorId };
}

function validarId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("ID de turma inválido.", 400);
  }
}

class TurmaService {
  // 1. CREATE
  async registrar({ nome, tipoUser, professorId } = {}) {
    if (tipoUser !== "professor") {
      throw new AppError("Apenas professores podem criar turmas.", 403);
    }

    if (typeof nome !== "string" || !nome.trim()) {
      throw new AppError("O nome da turma é obrigatório.", 400);
    }

    if (!professorId || !mongoose.Types.ObjectId.isValid(professorId)) {
      throw new AppError("ID do professor inválido.", 400);
    }

    const professorExiste = await Professor.exists({
      _id: professorId,
    });

    if (!professorExiste) {
      throw new AppError("Professor não encontrado.", 404);
    }

    try {
      return await Turma.create({
        nome: nome.trim(),
        professorId,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError(
          "Não foi possível gerar um código de convite único. Tente novamente.",
          409
        );
      }

      throw error;
    }
  }

  // 2. READ ALL
  // Administrador lista todas; professor lista somente as próprias.
  async listarTodas(acesso) {
    const filtro = validarAcesso(acesso);

    const turmas = await Turma.find(filtro)
      .populate("professorId", "nome sobrenome")
      .lean();

    return Promise.all(
      turmas.map(async (turma) => {
        const totalAlunos = await Aluno.countDocuments({
          turmaId: turma._id,
        });

        return {
          ...turma,
          totalAlunos,
        };
      })
    );
  }

  // 3. READ ONE
  async buscarPorId(id, acesso) {
    validarId(id);

    const filtro = {
      _id: id,
      ...validarAcesso(acesso),
    };

    const turma = await Turma.findOne(filtro)
      .populate("professorId", "nome sobrenome")
      .lean();

    if (!turma) {
      throw new AppError(
        "Turma não encontrada ou você não tem permissão para acessá-la.",
        404
      );
    }

    const alunos = await Aluno.find({
      turmaId: turma._id,
    })
      .select("_id nome sobrenome")
      .lean();

    return {
      ...turma,
      alunos,
      totalAlunos: alunos.length,
    };
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
      { new: true, runValidators: true }
    ).populate("professorId", "nome sobrenome");

    if (!turmaAtualizada) {
      throw new AppError(
        "Turma não encontrada ou você não tem permissão para atualizá-la.",
        404
      );
    }

    return turmaAtualizada;
  }

  // 5. DELETE
  // Exige confirmação explícita quando existem alunos vinculados.
  async deletar(
    id,
    acesso,
    { confirmarDesvinculacao = false } = {}
  ) {
    validarId(id);

    const filtro = {
      _id: id,
      ...validarAcesso(acesso),
    };

    const turma = await Turma.findOne(filtro);

    if (!turma) {
      throw new AppError(
        "Turma não encontrada ou você não tem permissão para excluí-la.",
        404
      );
    }

    const totalAlunos = await Aluno.countDocuments({
      turmaId: turma._id,
    });

    if (totalAlunos > 0 && !confirmarDesvinculacao) {
      throw new AppError(
        `Esta turma possui ${totalAlunos} aluno(s) vinculado(s). Confirme a desvinculação antes de excluí-la.`,
        409
      );
    }

    if (totalAlunos > 0) {
      await Aluno.updateMany(
        { turmaId: turma._id },
        { $set: { turmaId: null } }
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