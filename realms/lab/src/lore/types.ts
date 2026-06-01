/** An action-selection strategy a Guinea Pig plays with. */
export enum Character {
  Random = 'random',
  Greedy = 'greedy',
  Lookahead = 'lookahead',
}

/** Why a Trial ended. Mirrors the engine's outcome reasons. */
export enum TerminationReason {
  HeroDefeated = 'heroDefeated',
  DeckOut = 'deckOut',
  TurnLimit = 'turnLimit',
}

/** Lifecycle of an Experiment from creation to completion. */
export enum ExperimentStatus {
  Pending = 'pending',
  Running = 'running',
  Done = 'done',
  Failed = 'failed',
}

/** One term of a Criterion: a feature name and the weight applied to it. */
export interface Weight {
  feature: string;
  weight: number;
}
