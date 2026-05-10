import { z } from 'zod';

import { CodexSettingsSchema, DEFAULT_CODEX_SETTINGS } from './codex';

export const UniverseSettingsSchema = z.looseObject({
  codex: CodexSettingsSchema,
});
export type UniverseSettingsDto = z.infer<typeof UniverseSettingsSchema>;

export const DEFAULT_UNIVERSE_SETTINGS: UniverseSettingsDto = {
  codex: DEFAULT_CODEX_SETTINGS,
};

const UpdateUniverseSettingsSchema = z.looseObject({
  codex: CodexSettingsSchema.optional(),
});

export const UniverseSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  cover: z.url().optional(),
});
export type UniverseSummaryDto = z.infer<typeof UniverseSummarySchema>;

export const UniverseSchema = UniverseSummarySchema.extend({
  settings: UniverseSettingsSchema,
});
export type UniverseDto = z.infer<typeof UniverseSchema>;

export const CreateUniverseSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  cover: z.url().optional(),
  settings: UniverseSettingsSchema.default(DEFAULT_UNIVERSE_SETTINGS),
});
export type CreateUniverseDto = z.infer<typeof CreateUniverseSchema>;

export const UpdateUniverseSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  cover: z.url().optional(),
  settings: UpdateUniverseSettingsSchema.optional(),
});
export type UpdateUniverseDto = z.infer<typeof UpdateUniverseSchema>;
