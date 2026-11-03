import jwt from "jsonwebtoken";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "./auth.js";

const JWT_SECRET_TESTE = "segredo-apenas-para-testes";

const criarResposta = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);

  return res;
};

describe("Middleware auth", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", JWT_SECRET_TESTE);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("deve retornar 401 quando nenhum token for enviado", () => {
    const req = { headers: {} };
    const res = criarResposta();
    const next = vi.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Acesso negado. Token não fornecido.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando o formato do token for inválido", () => {
    const req = {
      headers: {
        authorization: "Basic token-invalido",
      },
    };

    const res = criarResposta();
    const next = vi.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Erro de formatação no Token.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando o token for inválido", () => {
    const req = {
      headers: {
        authorization: "Bearer token-invalido",
      },
    };

    const res = criarResposta();
    const next = vi.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Token inválido ou expirado.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve permitir acesso quando o token for válido", () => {
    const payload = {
      professorId: "professor-123",
      tipoUser: "professor",
    };

    const token = jwt.sign(payload, JWT_SECRET_TESTE, {
      algorithm: "HS256",
    });

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = criarResposta();
    const next = vi.fn();

    auth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.usuario).toMatchObject(payload);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("deve retornar 500 quando JWT_SECRET não estiver configurado", () => {
    vi.stubEnv("JWT_SECRET", "");

    const req = {
      headers: {
        authorization: "Bearer qualquer-token",
      },
    };

    const res = criarResposta();
    const next = vi.fn();

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Erro interno no servidor.",
    });
    expect(next).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("deve rejeitar token cujo conteúdo não seja um objeto", () => {
    const token = jwt.sign("payload-texto", JWT_SECRET_TESTE, {
      algorithm: "HS256",
    });

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = criarResposta();
    const next = vi.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Token inválido ou expirado.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
