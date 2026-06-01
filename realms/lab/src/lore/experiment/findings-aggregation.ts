import type { CombatantId } from '@dod/engine';

import type { Trial } from '../trial/trial.entity';
import type { TerminationReason } from '../types';
import {
  type CardStat,
  Findings,
  type ScorePoint,
  type ScoreTrajectory,
  type WinRate,
} from './findings';

const CONFIDENCE_Z = 1.96;

type PlayEvent = { kind: 'PlayEvent'; combatant: CombatantId; card: string };

/**
 * Computes an Experiment's Findings from its completed Trials — win rates with
 * confidence margins, the length distribution, per-turn score trajectories,
 * per-Card statistics, and the termination-reason breakdown. Pure: the scores
 * it aggregates were recorded into each Observation during the Trial.
 */
export class FindingsAggregation {
  public aggregate(trials: Trial[]): Findings {
    const combatants = this.combatants(trials);
    return new Findings({
      sampleSize: trials.length,
      winRates: combatants.map((id) => this.winRate(trials, id)),
      lengthDistribution: this.lengthDistribution(trials),
      scoreTrajectories: combatants.map((id) => this.trajectory(trials, id)),
      cards: this.cards(trials),
      terminationReasons: this.terminationReasons(trials),
    });
  }

  private combatants(trials: Trial[]): CombatantId[] {
    const first = trials[0];
    return first === undefined
      ? []
      : first.initialState.combatants.map((combatant) => combatant.id);
  }

  private winRate(trials: Trial[], id: CombatantId): WinRate {
    const wins = trials.filter((trial) => trial.outcome.winner === id).length;
    const rate = trials.length === 0 ? 0 : wins / trials.length;
    const margin = proportionMargin(rate, trials.length);
    return {
      combatantId: id,
      rate,
      margin,
      inconclusive: Math.abs(rate - 0.5) < margin,
    };
  }

  private lengthDistribution(trials: Trial[]): Record<number, number> {
    const distribution: Record<number, number> = {};
    for (const trial of trials) {
      distribution[trial.turnsPlayed] =
        (distribution[trial.turnsPlayed] ?? 0) + 1;
    }
    return distribution;
  }

  private trajectory(trials: Trial[], id: CombatantId): ScoreTrajectory {
    const byTurn = new Map<number, number[]>();
    for (const trial of trials) {
      for (const observation of trial.observations) {
        const turn = observation.state.turn.number;
        byTurn.set(turn, [...(byTurn.get(turn) ?? []), observation.scores[id]]);
      }
    }
    const points = [...byTurn.entries()]
      .sort(([left], [right]) => left - right)
      .map(([turn, scores]) => scorePoint(turn, scores));
    return { combatantId: id, points };
  }

  private cards(trials: Trial[]): CardStat[] {
    const played = new Map<string, number>();
    const won = new Map<string, number>();
    for (const trial of trials) {
      const plays = this.plays(trial);
      for (const card of new Set(plays.map((play) => play.card))) {
        played.set(card, (played.get(card) ?? 0) + 1);
        const wonByPlayer = plays.some(
          (play) =>
            play.card === card && trial.outcome.winner === play.combatant,
        );
        won.set(card, (won.get(card) ?? 0) + (wonByPlayer ? 1 : 0));
      }
    }
    return [...played.entries()].map(([cardId, count]) => ({
      cardId,
      frequency: trials.length === 0 ? 0 : count / trials.length,
      winWhenPlayed: count === 0 ? 0 : (won.get(cardId) ?? 0) / count,
    }));
  }

  private terminationReasons(
    trials: Trial[],
  ): Partial<Record<TerminationReason, number>> {
    const counts: Partial<Record<TerminationReason, number>> = {};
    for (const trial of trials) {
      const reason = trial.outcome.reason as TerminationReason;
      counts[reason] = (counts[reason] ?? 0) + 1;
    }
    return counts;
  }

  private plays(trial: Trial): PlayEvent[] {
    return trial.observations
      .flatMap((observation) => observation.events)
      .filter((event) => event.kind === 'PlayEvent') as PlayEvent[];
  }
}

function proportionMargin(rate: number, sampleSize: number): number {
  return sampleSize === 0
    ? 0
    : CONFIDENCE_Z * Math.sqrt((rate * (1 - rate)) / sampleSize);
}

function scorePoint(turn: number, scores: number[]): ScorePoint {
  const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const variance =
    scores.reduce((sum, value) => sum + (value - mean) ** 2, 0) / scores.length;
  const margin = CONFIDENCE_Z * Math.sqrt(variance / scores.length);
  return { turn, mean, margin };
}
