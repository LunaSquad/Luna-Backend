import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  // Aplica as regras recomendadas de JavaScript padrão
  js.configs.recommended,

  // Desativa regras do ESLint que conflitam com o Prettier
  prettierConfig,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "*.config.js",
      "*.config.mjs",
    ],
  },
];