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

export async function deletarArquivoAntigoPorUrl(url) {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return;

  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);
    if (!match?.[1]) return;

    const publicId = match[1];
    const isPdf = url.toLowerCase().endsWith(".pdf");

    await cloudinary.uploader.destroy(publicId, {
      resource_type: isPdf ? "raw" : "image",
    });
  } catch (erro) {
    console.error("Erro ao deletar arquivo antigo do Cloudinary por URL:", erro);
  }
}