import type { CodexContentDto } from './codex/CodexContent';
import type { Action, BattleEvent } from './contract';
import type { BattleDto } from './model/Battle';
import type { RulesetDto } from './Ruleset';

export type Activation =
  | 'emptySlot'
  | 'replaceOwnerMinion'
  | 'enemyMinion'
  | 'ownerMinion'
  | 'immediate';

export interface PlayableCard {
  cardId: string;
  activation: Activation;
}

export interface TargetCategories {
  ownerMinions: string[];
  enemyMinions: string[];
  emptySlots: number[];
}

export interface BattleView {
  battle: BattleDto;
  playableCards: PlayableCard[];
  targets: TargetCategories;
}

export type EventListener = (event: BattleEvent) => void;

export interface ConstructInput {
  codex: CodexContentDto;
  ruleset: RulesetDto;
  battle: BattleDto;
  seed: string;
  onEvent?: EventListener;
}

export abstract class BattleEngine {
  public abstract observe(): BattleView;
  public abstract submit(action: Action): void;
  public abstract peek(action: Action): BattleEngine;
}
