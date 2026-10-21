import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const criarUploader = (nomeDaPasta) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `luna_uploads/${nomeDaPasta}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'], 
    },
  });

  return multer({ 
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
  });
};

export { cloudinary };

export const uploadProfessor = criarUploader('professores');
export const uploadAluno = criarUploader('alunos');
export const uploadDocumento = criarUploader('documentos');
export const uploadPlanoDeAula = criarUploader('planos_de_aula');