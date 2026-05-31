import { z } from 'zod';

/**
 * Engine boundary — the wire shapes the engine exposes to whatever drives it.
 * These are intentionally thin stubs: the full state, action, and event shapes
 * are pinned by DOD-0032 (Engine prototype), and the runtime interface —
 * `Construct` / `Observe` / `Submit` / `Peek` — is defined by DOD-0030 (Lab and
 * engine mock). They live here, rather than being re-declared by each caller,
 * because callers persist and serve them.
 */

/** Identifies one combatant within a Battle. */
export const CombatantIdSchema = z.string();
export type CombatantId = z.infer<typeof CombatantIdSchema>;

/**
 * The two action kinds a player submits. Minion attacks and element damage are
 * not actions — they resolve automatically inside `Submit`.
 */
export const ActionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('playCard'),
    card: z.string(),
    target: z.unknown().optional(),
  }),
  z.object({ kind: z.literal('endTurn') }),
]);
export type Action = z.infer<typeof ActionSchema>;

/** Why a Battle ended; `winner` is null on a draw or turn-limit stalemate. */
export const OutcomeSchema = z.object({
  winner: CombatantIdSchema.nullable(),
  reason: z.string(),
});
export type Outcome = z.infer<typeof OutcomeSchema>;

/** An event fired during `Submit` resolution. Full taxonomy pinned by DOD-0032. */
export const BattleEventSchema = z.looseObject({ kind: z.string() });
export type BattleEvent = z.infer<typeof BattleEventSchema>;

/** The observed Battle state. Universe-specific shape pinned by DOD-0032. */
export const BattleSchema = z.unknown();
export type Battle = z.infer<typeof BattleSchema>;

/** Per-side starting data the engine consumes at `Construct`. Opaque to Lab. */
export const BattleSetupSchema = z.unknown();
export type BattleSetup = z.infer<typeof BattleSetupSchema>;

/** Codex content snapshot (Cards, Heroes, dictionaries) the engine resolves against. */
export const CodexContentSchema = z.unknown();
export type CodexContent = z.infer<typeof CodexContentSchema>;
