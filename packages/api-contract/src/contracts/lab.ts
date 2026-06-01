import { z } from 'zod';

import {
  ActionSchema,
  BattleEventSchema,
  BattleSchema,
  CodexContentSchema,
  CombatantIdSchema,
  OutcomeSchema,
} from '@dod/engine';

import { ExpressionSchema } from './codex';

const Id = z.uuid();
const UniverseId = z.string().min(1);
const Name = z.string().min(1).max(100);

export const CHARACTER_VALUES = ['random', 'greedy', 'lookahead'] as const;
export const CharacterSchema = z.enum(CHARACTER_VALUES);
export type Character = z.infer<typeof CharacterSchema>;

export const GuineaPigSchema = z.discriminatedUnion('character', [
  z.object({ character: z.literal('random') }),
  z.object({ character: z.literal('greedy') }),
  z.object({ character: z.literal('lookahead'), depth: z.int().positive() }),
]);
export type GuineaPigDto = z.infer<typeof GuineaPigSchema>;

export const FeatureSchema = z.object({
  name: z.string().min(1),
  expression: ExpressionSchema,
});
export type FeatureDto = z.infer<typeof FeatureSchema>;

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

export const SideSchema = z.object({
  guineaPig: GuineaPigSchema,
  criterionId: Id,
});
export type SideDto = z.infer<typeof SideSchema>;

export const ProtocolSchema = z.object({
  id: Id,
  name: Name.optional(),
  universeId: UniverseId,
  initialState: BattleSchema,
  sides: z.tuple([SideSchema, SideSchema]),
  turnLimit: z.int().positive(),
});
export type ProtocolDto = z.infer<typeof ProtocolSchema>;

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

const CandidateSchema = z.object({
  action: ActionSchema,
  score: z.number().optional(),
});

export const ObservationSchema = z.object({
  state: BattleSchema,
  candidates: z.array(CandidateSchema),
  action: ActionSchema,
  events: z.array(BattleEventSchema),
  scores: z.record(CombatantIdSchema, z.number()),
});
export type ObservationDto = z.infer<typeof ObservationSchema>;

export const TrialSchema = z.object({
  id: Id,
  seed: z.string(),
  initialState: BattleSchema,
  observations: z.array(ObservationSchema),
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

const WinRateSchema = z.object({
  combatantId: CombatantIdSchema,
  rate: z.number(),
  margin: z.number(),
  inconclusive: z.boolean(),
});

const ScoreTrajectorySchema = z.object({
  combatantId: CombatantIdSchema,
  points: z.array(
    z.object({
      turn: z.int().nonnegative(),
      mean: z.number(),
      margin: z.number(),
    }),
  ),
});

const CardStatSchema = z.object({
  cardId: z.string(),
  frequency: z.number(),
  winWhenPlayed: z.number(),
});

export const FindingsSchema = z.object({
  sampleSize: z.int().nonnegative(),
  winRates: z.array(WinRateSchema),
  lengthDistribution: z.record(z.string(), z.int().nonnegative()),
  scoreTrajectories: z.array(ScoreTrajectorySchema),
  cards: z.array(CardStatSchema),
  terminationReasons: z.record(z.string(), z.int().nonnegative()),
});
export type FindingsDto = z.infer<typeof FindingsSchema>;

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
  protocol: ProtocolSchema,
  codex: CodexContentSchema,
  findings: FindingsSchema.optional(),
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
