import { cloudinary } from "../upload-imagem.js";

export async function limparArquivoCloudinary(file) {
  if (!file?.filename) return;

  try {
    await cloudinary.uploader.destroy(file.filename);
  } catch (erroCloudinary) {
    console.error(
      "Erro ao remover arquivo órfão no Cloudinary:",
      erroCloudinary,
    );
  }
}

export async function limparArquivosMultiplosCloudinary(files) {
  if (!files || typeof files !== "object") return;

  const listaArquivos = Object.values(files).flat();

  const resultados = await Promise.allSettled(
    listaArquivos.map((file) =>
      file?.filename
        ? cloudinary.uploader.destroy(file.filename)
        : Promise.resolve()
    )
  );

  resultados.forEach((resultado) => {
    if (resultado.status === "rejected") {
      console.error(
        "Erro ao remover arquivo do Cloudinary:",
        resultado.reason,
      );
    }
  });
}