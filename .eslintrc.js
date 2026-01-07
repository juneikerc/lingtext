module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    "@eslint/js/recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  rules: {
    // React
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    // TypeScript
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    // General
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",

    // Accessibility
    "jsx-a11y/anchor-is-valid": "off", // React Router handles this
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [
    "build/",
    "node_modules/",
    ".react-router/",
    "worker-configuration.d.ts",
  ],
};
