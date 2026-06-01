import { z } from 'zod';

export const CombatantIdSchema = z.string();
export type CombatantId = z.infer<typeof CombatantIdSchema>;

export const TargetRefSchema = z.union([
  z.object({ slot: z.int().nonnegative() }),
  z.object({ minion: z.string() }),
]);
export type TargetRef = z.infer<typeof TargetRefSchema>;

export const ActionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('playCard'),
    cardId: z.string(),
    target: TargetRefSchema.optional(),
  }),
  z.object({ kind: z.literal('endTurn') }),
]);
export type Action = z.infer<typeof ActionSchema>;

export const OutcomeSchema = z.object({
  winner: CombatantIdSchema.nullable(),
  reason: z.string(),
});
export type Outcome = z.infer<typeof OutcomeSchema>;

export const BattleEventSchema = z.looseObject({ kind: z.string() });
export type BattleEvent = z.infer<typeof BattleEventSchema>;

export const BattleSchema = z.unknown();

export const CodexContentSchema = z.unknown();
