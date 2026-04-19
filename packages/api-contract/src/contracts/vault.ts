import { z } from 'zod';

export const FileSchema = z.object({
  id: z.uuid(),
  category: z.string(),
  name: z.string(),
  mimetype: z.string(),
  url: z.url(),
});
export type FileDto = z.infer<typeof FileSchema>;

export const UploadFileSchema = z.object({
  id: z.uuid().optional(),
  category: z.string().optional(),
});
export type UploadFileDto = z.infer<typeof UploadFileSchema>;
