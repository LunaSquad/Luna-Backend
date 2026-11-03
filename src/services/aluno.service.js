import Aluno from "../models/aluno.model.js";
import Usuario from "../models/usuario.model.js";
import UsuarioService from "./usuario.service.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class AlunoService {
  // 1. CREATE - Método para registar um novo aluno
  async registrar(dadosAluno, dadosUsuario) {
    const novoUsuario = await UsuarioService.criarUsuario({
      ...dadosUsuario,
      tipoUser: "aluno",
    });

    try {
      const novoAluno = new Aluno({
        ...dadosAluno,
        email: dadosUsuario.email,
        usuarioId: novoUsuario._id,
      });

      return await novoAluno.save();
    } catch (error) {
      await Usuario.findByIdAndDelete(novoUsuario._id);
      throw new Error(`Erro ao registar aluno: ${error.message}`);
    }
  }

  // 2. READ ALL - Método para listar todos os alunos
  async listarTodos(semTurma = false, incluirTurmaId = null) {
    try {
      const filtro = {};

      if (semTurma) {
        if (incluirTurmaId && mongoose.Types.ObjectId.isValid(incluirTurmaId)) {
          filtro.$or = [{ turmaId: null }, { turmaId: incluirTurmaId }];
        } else {
          filtro.turmaId = null;
        }
      }

      return await Aluno.find(filtro)
        .populate("usuarioId", "email tipoUser")
        .populate("turmaId", "nome");
    } catch (error) {
      throw new Error(`Erro ao buscar alunos: ${error.message}`);
    }
  }

  // 3. READ ONE - Método para buscar um aluno por ID
  async buscarPorId(id) {
    const aluno = await Aluno.findOne({ _id: id })
      .populate("usuarioId", "email tipoUser")
      .populate("turmaId", "nome");

    if (!aluno) {
      throw new Error("Aluno não encontrado.");
    }
    return aluno;
  }

  // 4. UPDATE - Método para atualizar os dados do aluno
  async atualizar(id, dadosAtualizados) {
    const alunoAtual = await Aluno.findOne({ _id: id });

    if (!alunoAtual) {
      throw new Error("Aluno não encontrado para a atualização.");
    }

    if (dadosAtualizados.urlFotoAluno && alunoAtual.urlFotoAluno) {
      if (dadosAtualizados.urlFotoAluno !== alunoAtual.urlFotoAluno) {
        try {
          const partes = alunoAtual.urlFotoAluno.split("/");
          const publicId = partes.slice(-3).join("/").split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Erro ao apagar foto antiga do aluno:", err);
        }
      }
    }

    if (dadosAtualizados.urlFotoLaudo && alunoAtual.urlFotoLaudo) {
      if (dadosAtualizados.urlFotoLaudo !== alunoAtual.urlFotoLaudo) {
        try {
          const partes = alunoAtual.urlFotoLaudo.split("/");
          const publicId = partes.slice(-3).join("/").split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Erro ao apagar laudo antigo do aluno:", err);
        }
      }
    }
    const alunoAtualizado = await Aluno.findOneAndUpdate(
      { _id: id },
      dadosAtualizados,
      { new: true }
    );

    if (!alunoAtualizado) {
      throw new Error("Aluno não encontrado para a atualização.");
    }
    return alunoAtualizado;
  }

  // 5. DELETE - Método para excluir um aluno
  async deletar(id) {
    const aluno = await Aluno.findOne({ _id: id });

    if (!aluno) {
      throw new Error("Aluno não encontrado para a exclusão.");
    }

    if (aluno.urlFotoAluno) {
      try {
        const partes = aluno.urlFotoAluno.split("/");
        const publicId = partes.slice(-3).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Erro ao apagar foto do aluno no Cloudinary:", err);
      }
    }

    if (aluno.urlFotoLaudo) {
      try {
        const partes = aluno.urlFotoLaudo.split("/");
        const publicId = partes.slice(-3).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Erro ao apagar laudo do aluno no Cloudinary:", err);
      }
    }

    await Aluno.findByIdAndDelete(id);

    await Usuario.findByIdAndDelete(aluno.usuarioId);

    return { mensagem: "Aluno e credenciais de acesso excluídos com sucesso." };
  }
}

export default new AlunoService();
