import { z } from 'zod';

export const ManaTypeSchema = z.enum(['Common', 'Special']);
export type ManaType = z.infer<typeof ManaTypeSchema>;

export const ManaSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: ManaTypeSchema,
});
export type ManaDto = z.infer<typeof ManaSchema>;

export const CreateManaSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: ManaTypeSchema,
});
export type CreateManaDto = z.infer<typeof CreateManaSchema>;

export const CardSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  level: z.int(),
  cost: z.int(),
  manaId: z.uuid(),
});
export type CardDto = z.infer<typeof CardSchema>;

export const CreateCardSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  level: z.int().min(1),
  cost: z.int().min(0),
  manaId: z.uuid(),
});
export type CreateCardDto = z.infer<typeof CreateCardSchema>;
