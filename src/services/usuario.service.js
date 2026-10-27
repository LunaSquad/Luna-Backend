import Usuario from '../models/usuario.model.js';
import bcrypt from "bcrypt";
import { AppError } from "../middlewares/helpers/app-error.js";

class UsuarioService {

  // Método pra criar um novo usuário
  async criarUsuario(dados) {
    const usuarioExistente = await Usuario.findOne({ email: dados.email });
    if (usuarioExistente) {
      throw new AppError("Este e-mail já está em uso.", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(dados.senha, salt);

    const novoUsuario = new Usuario({
      email: dados.email,
      senha: senhaCriptografada,
      tipoUser: dados.tipoUser
    })

    // Retorna o usuário criado
    return await novoUsuario.save();
  }


  // Método da busca de usuario por email
  async buscarUsuarioPorEmail(email) {
    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    return usuario;
  }
}

export default new UsuarioService();