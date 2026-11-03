import express from "express";
import { createServer } from "node:http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { connectionMock } = vi.hoisted(() => ({
  connectionMock: { readyState: 1 },
}));

vi.mock("mongoose", () => ({
  default: {
    connection: connectionMock,
  },
}));

import healthRoutes from "./health.routes.js";

describe("GET /health", () => {
  let server;
  let baseUrl;

  beforeEach(async () => {
    connectionMock.readyState = 1;

    const app = express();
    app.use(healthRoutes);

    server = createServer(app);

    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  it("deve retornar 200 quando o banco estiver conectado", async () => {
    connectionMock.readyState = 1;

    const response = await globalThis.fetch(`${baseUrl}/health`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.services.database).toBe("connected");
    expect(body.services.api).toBe("ok");
  });

  it("deve retornar 503 quando o banco estiver desconectado", async () => {
    connectionMock.readyState = 0;

    const response = await globalThis.fetch(`${baseUrl}/health`);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe("error");
    expect(body.services.database).toBe("disconnected");
  });
});
