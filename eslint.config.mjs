import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/node_modules", "**/lib"]), {
    extends: compat.extends(
        "@abhijithvijayan/eslint-config/typescript",
        "@abhijithvijayan/eslint-config/node",
    ),

    languageOptions: {
        globals: {
            ...globals.jest,
        },

        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "no-console": "off",
        "node/shebang": "off",
        "no-param-reassign": "warn",
        "@typescript-eslint/no-use-before-define": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "import/no-import-module-exports": "off",

        "node/no-unsupported-features/es-syntax": ["error", {
            ignores: ["modules"],
        }],
    },
}]);