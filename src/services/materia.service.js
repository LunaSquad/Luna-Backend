import Materia from '../models/materia.model.js';

class MateriaService {

  // 1. READ ALL
  async listarTodas() {
    return await Materia.find().sort({ nome: 1 }); 
  }
  

  // 2. READ ONE
  async buscarPorId(id) {
    return await Materia.findById(id);
  }
}

export default new MateriaService();