import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.js", "src/**/*.spec.js"],
    exclude: ["node_modules", "coverage"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "./coverage",
      include: [
        "src/routes/health.routes.js",
        "src/middlewares/auth.js",
        "src/middlewares/validacoes/validar-turma.js",
      ],
      exclude: [
        "src/**/*.test.js",
        "src/**/*.spec.js",
      ],
    },
  },
});