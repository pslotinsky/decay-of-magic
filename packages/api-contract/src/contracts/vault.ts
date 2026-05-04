import { z } from 'zod';

export const FileSchema = z.object({
  id: z.uuid(),
  category: z.string(),
  name: z.string(),
  mimetype: z.string(),
  url: z.url(),
});
export type FileDto = z.infer<typeof FileSchema>;

export const FileCropSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type FileCropDto = z.infer<typeof FileCropSchema>;

export const FileResizeSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type FileResizeDto = z.infer<typeof FileResizeSchema>;

export const FileTransformSchema = z.object({
  crop: FileCropSchema.optional(),
  resize: FileResizeSchema.optional(),
  format: z.literal('webp').optional(),
  quality: z.number().int().min(1).max(100).optional(),
});
export type FileTransformDto = z.infer<typeof FileTransformSchema>;

const TransformFieldSchema = z
  .string()
  .optional()
  .transform((value, ctx) => {
    if (value) {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Invalid transform JSON' });
        return z.NEVER;
      }
    }
  })
  .pipe(FileTransformSchema.optional());

export const UploadFileSchema = z.object({
  id: z.uuid().optional(),
  category: z.string().optional(),
  transform: TransformFieldSchema,
});
export type UploadFileDto = z.infer<typeof UploadFileSchema>;
