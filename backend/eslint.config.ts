import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"
export default defineConfig([
  {
    files: ["**/*.{ts,mts,cts}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: true, // Utilise tsconfig.json
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tseslint.configs.recommended,
])
