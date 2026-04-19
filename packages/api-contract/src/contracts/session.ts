import { z } from 'zod';

export const SessionSchema = z.object({
  accessToken: z.string(),
});
export type SessionDto = z.infer<typeof SessionSchema>;

export const CreateSessionSchema = z.object({
  nickname: z.string().min(1),
  secret: z.string().min(1),
});
export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;
