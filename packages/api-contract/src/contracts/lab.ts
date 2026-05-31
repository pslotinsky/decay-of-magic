import { z } from 'zod';

import {
  ActionSchema,
  BattleEventSchema,
  BattleSchema,
  BattleSetupSchema,
  CodexContentSchema,
  CombatantIdSchema,
  OutcomeSchema,
} from '@dod/engine';

import { ExpressionSchema } from './codex';

const Id = z.uuid();
const UniverseId = z.string().min(1);
const Name = z.string().min(1).max(100);

// --- Guinea Pig ---------------------------------------------------------------

export const CHARACTER_VALUES = ['random', 'greedy', 'lookahead'] as const;
export const CharacterSchema = z.enum(CHARACTER_VALUES);
export type Character = z.infer<typeof CharacterSchema>;

/** A configured player: a character plus the params that character takes. */
export const GuineaPigSchema = z.discriminatedUnion('character', [
  z.object({ character: z.literal('random') }),
  z.object({ character: z.literal('greedy') }),
  z.object({ character: z.literal('lookahead'), depth: z.int().positive() }),
]);
export type GuineaPigDto = z.infer<typeof GuineaPigSchema>;

// --- Feature ------------------------------------------------------------------

/**
 * A named expression over match state, evaluated per Combatant. Authored value
 * object; only its `name` is referenced by Criterion weights. The catalog is
 * per-Universe (hardcoded in Lab for MVP).
 */
export const FeatureSchema = z.object({
  name: z.string().min(1),
  expression: ExpressionSchema,
});
export type FeatureDto = z.infer<typeof FeatureSchema>;

// --- Criterion ----------------------------------------------------------------

const WeightSchema = z.object({
  feature: z.string().min(1),
  weight: z.number(),
});

export const CriterionSchema = z.object({
  id: Id,
  universeId: UniverseId,
  name: Name,
  weights: z.array(WeightSchema).min(1),
});
export type CriterionDto = z.infer<typeof CriterionSchema>;

export const CreateCriterionSchema = z.object({
  universeId: UniverseId,
  name: Name,
  weights: z.array(WeightSchema).min(1),
});
export type CreateCriterionDto = z.infer<typeof CreateCriterionSchema>;

export const UpdateCriterionSchema = z.object({
  name: Name.optional(),
  weights: z.array(WeightSchema).min(1).optional(),
});
export type UpdateCriterionDto = z.infer<typeof UpdateCriterionSchema>;

// --- Protocol -----------------------------------------------------------------

export const SideSchema = z.object({
  guineaPig: GuineaPigSchema,
  criterionId: Id,
});
export type SideDto = z.infer<typeof SideSchema>;

export const ProtocolSchema = z.object({
  id: Id,
  name: Name.optional(),
  universeId: UniverseId,
  initialSetup: BattleSetupSchema,
  sides: z.tuple([SideSchema, SideSchema]),
  turnLimit: z.int().positive(),
});
export type ProtocolDto = z.infer<typeof ProtocolSchema>;

// `initialSetup` is hardcoded server-side for the MVP universes, so it is not
// accepted on create.
export const CreateProtocolSchema = z.object({
  name: Name.optional(),
  universeId: UniverseId,
  sides: z.tuple([SideSchema, SideSchema]),
  turnLimit: z.int().positive(),
});
export type CreateProtocolDto = z.infer<typeof CreateProtocolSchema>;

export const UpdateProtocolSchema = z.object({
  name: Name.optional(),
  sides: z.tuple([SideSchema, SideSchema]).optional(),
  turnLimit: z.int().positive().optional(),
});
export type UpdateProtocolDto = z.infer<typeof UpdateProtocolSchema>;

// --- Trial & Observation ------------------------------------------------------

const CandidateSchema = z.object({
  action: ActionSchema,
  score: z.number().optional(), // absent for `random`
});

/** One decision point within a Trial. */
export const ObservationSchema = z.object({
  state: BattleSchema, // engine: Observe ingredients
  candidates: z.array(CandidateSchema), // lab: enumerated (action, target) pairs
  action: ActionSchema, // lab: the submitted candidate
  events: z.array(BattleEventSchema), // engine: fired during Submit
  scores: z.record(CombatantIdSchema, z.number()), // lab: state scored per Combatant
});
export type ObservationDto = z.infer<typeof ObservationSchema>;

export const TrialSchema = z.object({
  id: Id,
  seed: z.string(),
  initialState: BattleSchema,
  observations: z.array(ObservationSchema), // sampled — not every Trial is retained
  outcome: OutcomeSchema,
  turnsPlayed: z.int().nonnegative(),
});
export type TrialDto = z.infer<typeof TrialSchema>;

export const TrialSummarySchema = TrialSchema.pick({
  id: true,
  outcome: true,
  turnsPlayed: true,
});
export type TrialSummaryDto = z.infer<typeof TrialSummarySchema>;

// --- Findings -----------------------------------------------------------------

const WinRateSchema = z.object({
  combatant: CombatantIdSchema,
  rate: z.number(), // 0..1
  margin: z.number(), // ± confidence half-width
  inconclusive: z.boolean(), // interval crosses 50%
});

const ScoreTrajectorySchema = z.object({
  combatant: CombatantIdSchema,
  points: z.array(
    z.object({
      turn: z.int().nonnegative(),
      mean: z.number(),
      margin: z.number(),
    }),
  ),
});

const CardStatSchema = z.object({
  card: z.string(),
  frequency: z.number(), // play frequency when available
  winWhenPlayed: z.number(), // win-rate correlation when played
});

/** Aggregated conclusions of an Experiment. Computed from its Trials. */
export const FindingsSchema = z.object({
  sampleSize: z.int().nonnegative(), // N — always shown alongside every metric
  winRates: z.array(WinRateSchema),
  lengthDistribution: z.record(z.string(), z.int().nonnegative()), // turns bucket -> count
  scoreTrajectories: z.array(ScoreTrajectorySchema),
  cards: z.array(CardStatSchema),
  terminationReasons: z.record(z.string(), z.int().nonnegative()), // reason -> count
});
export type FindingsDto = z.infer<typeof FindingsSchema>;

// --- Experiment ---------------------------------------------------------------

export const EXPERIMENT_STATUS_VALUES = [
  'pending',
  'running',
  'done',
  'failed',
] as const;
export const ExperimentStatusSchema = z.enum(EXPERIMENT_STATUS_VALUES);
export type ExperimentStatus = z.infer<typeof ExperimentStatusSchema>;

export const ExperimentSchema = z.object({
  id: Id,
  protocolId: Id,
  trialCount: z.int().min(1),
  seed: z.string().optional(),
  status: ExperimentStatusSchema,
  protocol: ProtocolSchema, // resolved + frozen at start, for reproducibility
  codex: CodexContentSchema, // frozen Codex content snapshot
  findings: FindingsSchema.optional(), // present once status === 'done'
  trials: z.array(TrialSummarySchema),
  createdAt: z.iso.datetime(),
  createdBy: z.string(),
});
export type ExperimentDto = z.infer<typeof ExperimentSchema>;

export const CreateExperimentSchema = z.object({
  protocolId: Id,
  trialCount: z.int().min(1),
  seed: z.string().optional(),
});
export type CreateExperimentDto = z.infer<typeof CreateExperimentSchema>;
