import { z } from 'zod';

export const CitizenSchema = z.object({
  id: z.uuid(),
  nickname: z.string(),
});
export type CitizenDto = z.infer<typeof CitizenSchema>;

export const RegisterCitizenSchema = z.object({
  nickname: z.string().min(1).max(50),
  secret: z.string().min(8),
});
export type RegisterCitizenDto = z.infer<typeof RegisterCitizenSchema>;

export const UpdateCitizenSchema = z.object({
  nickname: z.string().min(1).max(50).optional(),
});
export type UpdateCitizenDto = z.infer<typeof UpdateCitizenSchema>;
