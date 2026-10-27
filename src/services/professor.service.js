import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Professor from "../models/professor.model.js";
import Usuario from "../models/usuario.model.js";
import Turma from "../models/turma.model.js";
import Aluno from "../models/aluno.model.js";
import UsuarioService from "./usuario.service.js";
import { AppError } from "../middlewares/helpers/app-error.js";
import { limparArquivoCloudinary, deletarArquivoAntigoPorUrl } from "../middlewares/helpers/limpar-cloudinary.js";

const SALT_ROUNDS = 10;

class ProfessorService {

  // 1. CREATE
  async registrar({ dadosUsuario, dadosProfessor }, file) {
    let novoUsuario = null;
    let novoProfessor = null;

    try {
      const cpfEmUso = await Professor.exists({
        cpf: dadosProfessor.cpf,
      });

      if (cpfEmUso) {
        throw new AppError("Este CPF já está cadastrado.", 409);
      }

      novoUsuario = await UsuarioService.criarUsuario({
        ...dadosUsuario,
        tipoUser: "professor",
      });

      novoProfessor = await Professor.create({
        ...dadosProfessor,
        dataNasc: new Date(dadosProfessor.dataNasc),
        usuarioId: novoUsuario._id,
        urlFotoProfessor: file.path,
      });

      return await Professor.findById(novoProfessor._id).populate(
        "usuarioId",
        "email tipoUser"
      );
    } catch (error) {
      if (novoProfessor) {
        await Professor.findByIdAndDelete(novoProfessor._id);
      }

      if (novoUsuario) {
        await Usuario.findByIdAndDelete(novoUsuario._id);
      }

      await limparArquivoCloudinary(file);

      if (error instanceof AppError) throw error;

      throw new AppError(
        `Erro ao registrar professor: ${error.message}`,
        400
      );
    }
  }


  // 2. READ ALL
  async listarTodos() {
    return await Professor.find().populate("usuarioId", "email tipoUser");
  }


  // 3. READ ONE
  async buscarPorId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    const professor = await Professor.findById(id).populate(
      "usuarioId",
      "email tipoUser"
    );

    if (!professor) {
      throw new AppError("Professor não encontrado.", 404);
    }

    return professor;
  }


  // 4. UPDATE
  async atualizar(id, { dadosUsuario, dadosProfessor } = {}, file) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await limparArquivoCloudinary(file);
      throw new AppError("ID de professor inválido.", 400);
    }

    let fotoNovaVinculada = false;

    try {
      const professorAtual = await Professor.findById(id);

      if (!professorAtual) {
        throw new AppError(
          "Professor não encontrado para atualização.",
          404
        );
      }

      // 4.1 Validar duplicidade de e-mail e CPF
      if (dadosUsuario?.email) {
        const emailEmUso = await Usuario.exists({
          email: dadosUsuario.email,
          _id: { $ne: professorAtual.usuarioId },
        });

        if (emailEmUso) {
          throw new AppError("Este e-mail já está em uso.", 409);
        }
      }

      if (dadosProfessor?.cpf && dadosProfessor.cpf !== professorAtual.cpf) {
        const cpfEmUso = await Professor.exists({
          cpf: dadosProfessor.cpf,
          _id: { $ne: professorAtual._id },
        });

        if (cpfEmUso) {
          throw new AppError("Este CPF já está cadastrado.", 409);
        }
      }

      // 4.2 Atualizar Usuario
      if (dadosUsuario && Object.keys(dadosUsuario).length > 0) {
        const camposUsuario = {};

        if (dadosUsuario.email) {
          camposUsuario.email = dadosUsuario.email;
        }

        if (dadosUsuario.senha) {
          camposUsuario.senha = await bcrypt.hash(
            dadosUsuario.senha,
            SALT_ROUNDS
          );
        }

        if (Object.keys(camposUsuario).length > 0) {
          await Usuario.findByIdAndUpdate(
            professorAtual.usuarioId,
            camposUsuario,
            { runValidators: true }
          );
        }
      }

      // 4.3 Atualizar Professor
      const camposProfessor = {};
      if (dadosProfessor) {
        const permitidos = ["nome", "sobrenome", "cpf", "cidade", "telefone"];
        for (const campo of permitidos) {
          if (dadosProfessor[campo] !== undefined) {
            camposProfessor[campo] = dadosProfessor[campo];
          }
        }
        if (dadosProfessor.dataNasc !== undefined) {
          camposProfessor.dataNasc = new Date(dadosProfessor.dataNasc);
        }
      }

      const urlFotoAntiga = professorAtual.urlFotoProfessor;
      if (file?.path) {
        camposProfessor.urlFotoProfessor = file.path;
      }

      let professorAtualizado;

      if (Object.keys(camposProfessor).length > 0) {
        professorAtualizado = await Professor.findByIdAndUpdate(
          id,
          { $set: camposProfessor },
          { new: true, runValidators: true }
        );

        if (file?.path && professorAtualizado) {
          fotoNovaVinculada = true;
        }

        if (professorAtualizado) {
          await professorAtualizado.populate("usuarioId", "email tipoUser");
        }
      } else {
        professorAtualizado = await Professor.findById(id).populate(
          "usuarioId",
          "email tipoUser"
        );
      }

      if (file?.path && urlFotoAntiga && urlFotoAntiga !== file.path) {
        await deletarArquivoAntigoPorUrl(urlFotoAntiga);
      }

      return professorAtualizado;

    } catch (error) {
      if (!fotoNovaVinculada) {
        await limparArquivoCloudinary(file);
      }

      if (error instanceof AppError) throw error;

      throw new AppError(
        `Erro ao atualizar professor: ${error.message}`,
        400
      );
    }
  }


  // 5. DELETE
  async deletar(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID de professor inválido.", 400);
    }

    const professor = await Professor.findById(id);
    if (!professor) {
      throw new AppError("Professor não encontrado para exclusão.", 404);
    }

    const possuiTurmas = await Turma.exists({
      professorId: professor._id,
    });

    if (possuiTurmas) {
      throw new AppError(
        "Não é possível excluir um professor que possui turmas vinculadas.",
        409
      );
    }

    await Promise.all([
      Professor.findByIdAndDelete(id),
      Usuario.findByIdAndDelete(professor.usuarioId),
    ]);

    if (professor.urlFotoProfessor) {
      await deletarArquivoAntigoPorUrl(professor.urlFotoProfessor);
    }

    return {
      mensagem: "Professor e credenciais de acesso excluídos com sucesso.",
    };
  }
}

export default new ProfessorService();