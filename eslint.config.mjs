import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig({
  extends: [
    ...nextVitals,
    ...nextTs,
  ],
  ignorePatterns: [
    // default ignores of eslint-config-next
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
    "@typescript-eslint/no-wrapper-object-types": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
    "no-var": "off",
  },
});

export default eslintConfig;
