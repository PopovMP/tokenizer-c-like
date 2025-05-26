// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic, {
  rules: {
    "curly": ["error", "multi-line"],
    "eqeqeq": ["error", "always"],
    "no-console": "off",
    "no-debugger": "error",
    "no-empty": "error",
    "no-implicit-coercion": "error",
    "no-return-await": "error",
    "no-shadow": "error",
    "no-var": "error",
    "no-trailing-spaces": "error",
    "indent": ["error", 2],
    "prefer-const": "error",
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "max-len": ["error", {
      code: 120,
      tabWidth: 2,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    "@typescript-eslint/no-extraneous-class": "off",
  }
}
);
