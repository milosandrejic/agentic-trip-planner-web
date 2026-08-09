import globals from "globals";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import checkFile from "eslint-plugin-check-file";
import stylisticPlugin from "@stylistic/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextTypescript from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

const sourceFiles = ["src/**/*.{ts,tsx}"];
const nextRouteFiles = [
  "src/app/**/page.tsx",
  "src/app/**/layout.tsx",
  "src/app/**/error.tsx",
  "src/app/**/loading.tsx",
  "src/app/**/not-found.tsx",
  "src/app/**/template.tsx",
];

function commonRules() {
  return {
    ...reactHooksPlugin.configs.recommended.rules,
    "no-shadow": "error",
    "func-names": "warn",
    "no-bitwise": "error",
    "object-shorthand": "warn",
    "no-useless-rename": "warn",
    "default-case-last": "error",
    "consistent-return": "error",
    "no-constant-condition": "warn",
    "no-unused-vars": "off",
    "default-case": ["error", { commentPattern: "^no default$" }],
    "lines-around-directive": ["error", { before: "always", after: "always" }],
    "arrow-body-style": "off",
    "no-constant-binary-expression": "off",
    "react/jsx-key": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "react/jsx-boolean-value": "error",
    "react/self-closing-comp": "error",
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
    "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "off",
  };
}

function importRules() {
  return {
    ...importPlugin.configs.recommended.rules,
    "import/named": "off",
    "import/export": "off",
    "import/default": "off",
    "import/namespace": "off",
    "import/no-named-as-default": "off",
    "import/newline-after-import": "error",
    "import/no-named-as-default-member": "off",
  };
}

function unusedCodesRules() {
  return {
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "no-unused-expressions": ["warn", { allowShortCircuit: true, allowTernary: true }],
    "no-unused-vars": "off",
    "no-unused-private-class-members": "warn",
  };
}

function sortImportsRules() {
  return {
    "perfectionist/sort-named-imports": ["warn", { type: "line-length", order: "asc" }],
    "perfectionist/sort-named-exports": ["warn", { type: "line-length", order: "asc" }],
    "perfectionist/sort-exports": ["warn", { order: "asc", type: "line-length" }],
    "perfectionist/sort-imports": [
      "error",
      {
        order: "asc",
        ignoreCase: true,
        type: "line-length",
        environment: "node",
        internalPattern: ["^@/.+"],
        groups: [
          "style",
          "side-effect",
          "type",
          ["builtin", "external"],
          "custom-mui",
          "custom-routes",
          "custom-hooks",
          "custom-utils",
          "internal",
          "custom-components",
          "custom-sections",
          "custom-auth",
          "custom-types",
          ["parent", "sibling", "index"],
          "unknown",
        ],
        customGroups: [
          { groupName: "custom-mui", elementNamePattern: "^@mui/.+" },
          { groupName: "custom-auth", elementNamePattern: "^@/auth/.+" },
          { groupName: "custom-hooks", elementNamePattern: "^@/hooks/.+" },
          { groupName: "custom-utils", elementNamePattern: "^@/utils/.+" },
          { groupName: "custom-types", elementNamePattern: "^@/types/.+" },
          { groupName: "custom-routes", elementNamePattern: "^@/routes/.+" },
          { groupName: "custom-sections", elementNamePattern: "^@/sections/.+" },
          { groupName: "custom-components", elementNamePattern: "^@/components/.+" },
        ],
      },
    ],
  };
}

const customConfig = {
  plugins: {
    "react-hooks": reactHooksPlugin,
    "unused-imports": unusedImportsPlugin,
    perfectionist: perfectionistPlugin,
    import: importPlugin,
    "@stylistic": stylisticPlugin,
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    ...commonRules(),
    ...importRules(),
    ...unusedCodesRules(),
    ...sortImportsRules(),
    quotes: ["warn", "double", { avoidEscape: true }],
    "@stylistic/quotes": ["warn", "double", { avoidEscape: true }],
    "@stylistic/semi": ["warn", "always"],
    curly: "error",
    "@stylistic/dot-location": ["warn", "property"],
    "@stylistic/indent": ["warn", 2, { SwitchCase: 1 }],
    "@stylistic/multiline-ternary": ["error", "never"],
    "@stylistic/space-before-function-paren": "off",
    "@stylistic/function-call-argument-newline": ["warn", "consistent"],
    "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 1 }],
  },
};

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  eslintJs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    ...customConfig,
  },
  {
    files: sourceFiles,
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
      ],
      "import/no-default-export": "error",
      "import/no-relative-parent-imports": "error",
      "object-curly-newline": [
        "error",
        {
          ImportDeclaration: {
            minProperties: 2,
            multiline: true,
          },
          ExportDeclaration: {
            minProperties: 2,
            multiline: true,
          },
        },
      ],
    },
  },
  {
    files: nextRouteFiles,
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: { "no-undef": "off" },
  },
  globalIgnores([
    ".next/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "node_modules/**",
    "out/**",
  ]),
]);
