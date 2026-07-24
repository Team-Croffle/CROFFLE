import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/out/**',
      '**/node_modules/**',
      '**/*.cjs',
      '**/build/**',
      '**/.stversions/**',
      '**/coverage/**',
      '**/.vscode/**',
      '**/.git/**',
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      promise: pluginPromise,
    },
    rules: {
      ...pluginPromise.configs.recommended.rules,
      'promise/catch-or-return': 'off',
      'promise/always-return': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        croffle: 'readonly',
      },
    },
    plugins: {
      import: pluginImport,
      unicorn: pluginUnicorn,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            pascalCase: true,
            camelCase: true,
          },
          ignore: [/.*~\d{8}-\d{6}\..*$/],
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },
  {
    files: ['packages/renderer/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './packages/renderer/tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    files: ['apps/desktop/src/**/*.{ts,tsx}', 'apps/desktop/electron.vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './apps/desktop/tsconfig.node.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './apps/desktop/tsconfig.node.json',
        },
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/no-v-html': 'warn',
    },
  },
  eslintConfigPrettier,
];
