import { describe, expect, it, vi } from "vitest";

import { validarCadastroTurma, validarUpdateTurma } from "./validar-turma.js";

const criarResposta = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);

  return res;
};

describe("Middleware de validação de turma", () => {
  describe("validarCadastroTurma", () => {
    it("deve aceitar o cadastro com dados válidos", () => {
      const req = {
        body: {
          dadosTurma: {
            nome: "  3º Ano A  ",
          },
        },
      };

      const res = criarResposta();
      const next = vi.fn();

      validarCadastroTurma(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req.body.dadosTurma.nome).toBe("3º Ano A");
      expect(res.status).not.toHaveBeenCalled();
    });

    it("deve rejeitar o cadastro sem nome", () => {
      const req = {
        body: {
          dadosTurma: {},
        },
      };

      const res = criarResposta();
      const next = vi.fn();

      validarCadastroTurma(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          erro: "Erro de validação no cadastro da turma.",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validarUpdateTurma", () => {
    it("deve aceitar a atualização com dados válidos", () => {
      const req = {
        body: {
          dadosTurma: {
            nome: "  4º Ano B  ",
          },
        },
      };

      const res = criarResposta();
      const next = vi.fn();

      validarUpdateTurma(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req.body.dadosTurma.nome).toBe("4º Ano B");
      expect(res.status).not.toHaveBeenCalled();
    });

    it("deve rejeitar a atualização sem dados da turma", () => {
      const req = {
        body: {},
      };

      const res = criarResposta();
      const next = vi.fn();

      validarUpdateTurma(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        erro: "Informe pelo menos um dado da turma para atualizar.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve rejeitar a atualização com dados vazios", () => {
      const req = {
        body: {
          dadosTurma: {},
        },
      };

      const res = criarResposta();
      const next = vi.fn();

      validarUpdateTurma(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          erro: "Erro de validação na atualização da turma.",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
