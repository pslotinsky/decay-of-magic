import { z } from 'zod';

export const UniverseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  cover: z.url().optional(),
});
export type UniverseDto = z.infer<typeof UniverseSchema>;

export const CreateUniverseSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  cover: z.url().optional(),
});
export type CreateUniverseDto = z.infer<typeof CreateUniverseSchema>;

export const UpdateUniverseSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  cover: z.url().optional(),
});
export type UpdateUniverseDto = z.infer<typeof UpdateUniverseSchema>;
