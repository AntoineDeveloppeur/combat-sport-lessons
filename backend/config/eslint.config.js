import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig([
    {
        ignores: ["**/dist/**", "**/node_modules/**"],
    },
    {
        files: ["**/*.{ts,mts,cts}"],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                project: "./config/tsconfig.json",
                tsconfigRootDir: join(__dirname, ".."),
            },
        },
    },
    ...tseslint.configs.recommended,
]);
