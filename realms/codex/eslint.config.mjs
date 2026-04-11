import { nestjs } from '@dod/config/eslint/nestjs';

export default [
  { ignores: ['prisma/generated/**'] },
  ...nestjs(import.meta.dirname),
];
