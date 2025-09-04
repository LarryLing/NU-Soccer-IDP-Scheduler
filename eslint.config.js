import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": ["error", {
        "type": "alphabetical",
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
      }],
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactRefresh.configs.recommended.rules,
    },
  },
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },
  {
    plugins: {
      react,
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  globalIgnores(["dist/**", "node_modules/**", "src/components/ui/**"]),
]);
