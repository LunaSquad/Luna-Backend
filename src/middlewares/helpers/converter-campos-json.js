export function converterCamposJSON(body, campos) {
  if (!body || typeof body !== "object") return;

  for (const campo of campos) {
    if (typeof body[campo] === "string") {
      try {
        const parsed = JSON.parse(body[campo]);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error();
        }

        body[campo] = parsed;
      } catch {
        const erro = new Error(`O campo "${campo}" contém um formato JSON inválido.`);
        erro.statusCode = 400;
        throw erro;
      }
    }
  }
}