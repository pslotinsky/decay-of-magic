import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export const base = tseslint.config(
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
);
