import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export const base = tseslint.config(
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': ['error', {
        groups: [
          ['^\\w', '^@(?!dod/)'],
          ['^@dod/'],
          ['^@/'],
          ['^\\.(?!.*\\.s?css$)'],
['\\.s?css$'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
);
