import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import type { Linter } from "eslint";
import tseslint from "typescript-eslint";

export function createBaseConfig(): Linter.Config[] {
  return [
    {
      ignores: ["dist/**", "coverage/**", "node_modules/**"],
    },
    js.configs.recommended,
    ...(tseslint.configs.recommended as Linter.Config[]),
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      plugins: {
        "@stylistic": stylistic,
      },
      rules: {
        "@stylistic/comma-dangle": ["error", "always-multiline"],
        "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
        "@stylistic/semi": ["error", "always"],
      },
    },
  ];
}

const baseConfig: Linter.Config[] = createBaseConfig();

export { baseConfig };
export default baseConfig;
