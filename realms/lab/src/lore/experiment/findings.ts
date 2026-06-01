import type { CombatantId } from '@dod/engine';

import type { TerminationReason } from '../types';

export type WinRate = {
  combatantId: CombatantId;
  rate: number;
  margin: number;
  inconclusive: boolean;
};

export type ScorePoint = {
  turn: number;
  mean: number;
  margin: number;
};

export type ScoreTrajectory = {
  combatantId: CombatantId;
  points: ScorePoint[];
};

export type CardStat = {
  cardId: string;
  frequency: number;
  winWhenPlayed: number;
};

export type FindingsParams = {
  sampleSize: number;
  winRates: WinRate[];
  lengthDistribution: Record<number, number>;
  scoreTrajectories: ScoreTrajectory[];
  cards: CardStat[];
  terminationReasons: Partial<Record<TerminationReason, number>>;
};

/**
 * Aggregated conclusions of an Experiment, computed from its Trials and never
 * edited directly. Carries win rates with confidence margins, the trial-length
 * distribution, per-turn score trajectories, per-Card statistics, and the
 * termination-reason breakdown.
 */
export class Findings {
  public readonly sampleSize: number;
  public readonly winRates: WinRate[];
  public readonly lengthDistribution: Record<number, number>;
  public readonly scoreTrajectories: ScoreTrajectory[];
  public readonly cards: CardStat[];
  public readonly terminationReasons: Partial<
    Record<TerminationReason, number>
  >;

  public constructor(params: FindingsParams) {
    this.sampleSize = params.sampleSize;
    this.winRates = params.winRates;
    this.lengthDistribution = params.lengthDistribution;
    this.scoreTrajectories = params.scoreTrajectories;
    this.cards = params.cards;
    this.terminationReasons = params.terminationReasons;
  }
}
