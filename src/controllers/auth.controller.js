import Usuario from "../models/usuario.model.js";
import Professor from "../models/professor.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({ email }).select("+senha");

      if (!usuario) {
        return res.status(401).json({
          erro: "E-mail ou senha inválidos.",
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({
          erro: "E-mail ou senha inválidos.",
        });
      }

      // Alunos utilizam o aplicativo mobile
      if (usuario.tipoUser === "aluno") {
        return res.status(403).json({
          erro: "Acesso ao sistema web não autorizado para este usuário.",
        });
      }

      // Somente professores e administradores podem acessar o Web
      if (!["professor", "admin"].includes(usuario.tipoUser)) {
        return res.status(403).json({
          erro: "Tipo de usuário não autorizado para o sistema web.",
        });
      }

      let professor = null;

      // Somente professores precisam de um perfil Professor
      if (usuario.tipoUser === "professor") {
        professor = await Professor.findOne({
          usuarioId: usuario._id,
        });

        if (!professor) {
          console.error(
            "Usuário professor sem perfil associado:",
            usuario._id
          );

          return res.status(500).json({
            erro: "Erro de integridade: perfil do professor não encontrado.",
          });
        }
      }

      const payload = {
        id: usuario._id,
        tipoUser: usuario.tipoUser,
      };

      if (professor) {
        payload.professorId = professor._id;
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        console.error("JWT_SECRET não foi configurado.");

        return res.status(500).json({
          erro: "Erro interno no servidor.",
        });
      }

      const token = jwt.sign(payload, secret, {
        expiresIn: "1d",
        algorithm: "HS256",
      });

      const dadosUsuario = {
        id: usuario._id,
        email: usuario.email,
        tipoUser: usuario.tipoUser,
      };

      if (professor) {
        dadosUsuario.nome = professor.nome;
        dadosUsuario.foto = professor.urlFotoProfessor;
      }

      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: dadosUsuario,
      });
    } catch (error) {
      console.error("Erro no AuthController:", error);

      return res.status(500).json({
        erro: "Erro interno ao realizar o login.",
      });
    }
  }
}

export default new AuthController();