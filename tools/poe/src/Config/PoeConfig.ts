import { z } from 'zod';

const RendererKindSchema = z.enum([
  'api',
  'application',
  'domain',
  'infrastructure',
]);

const LayerConfigSchema = z.object({
  title: z.string().min(1),
  root: z.string().min(1),
  renderer: RendererKindSchema,
});

export const PoeConfigSchema = z.object({
  layers: z.array(LayerConfigSchema).min(1),
});

export type RendererKind = z.infer<typeof RendererKindSchema>;
export type LayerConfig = z.infer<typeof LayerConfigSchema>;
export type PoeConfig = z.infer<typeof PoeConfigSchema>;
