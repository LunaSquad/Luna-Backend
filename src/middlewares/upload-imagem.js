import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import cloudinary from "../config/cloudinary.js";

const criarUploader = (nomeDaPasta) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `luna_uploads/${nomeDaPasta}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

export { cloudinary };

export const uploadProfessor = criarUploader("professores");
export const uploadAluno = criarUploader("alunos");
export const uploadDocumento = criarUploader("documentos");
export const uploadPlanoDeAula = criarUploader("planos_de_aula");
