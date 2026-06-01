import type {
  Action,
  Activation,
  BattleView,
  TargetCategories,
  TargetRef,
} from '@dod/engine';

/**
 * The legal actions at one decision point. Matches each playable card's
 * activation to the available target categories to form the (card, target)
 * plays, and always offers `endTurn`. The engine yields the ingredients; Lab
 * combines them — scoring and choosing among them is the Guinea Pig's job.
 */
export class LegalActions {
  private readonly actions: Action[];

  public constructor(view: BattleView) {
    const plays = view.playableCards.flatMap((card) =>
      this.enumerateTargets(card.activation, view.targets).map((target) =>
        this.play(card.cardId, target),
      ),
    );
    this.actions = [...plays, { kind: 'endTurn' }];
  }

  public list(): Action[] {
    return this.actions;
  }

  private enumerateTargets(
    activation: Activation,
    targets: TargetCategories,
  ): (TargetRef | undefined)[] {
    switch (activation) {
      case 'emptySlot':
        return targets.emptySlots.map((slot) => ({ slot }));
      case 'immediate':
        return [undefined];
      case 'enemyMinion':
        return targets.enemyMinions.map((minion) => ({ minion }));
      case 'ownerMinion':
      case 'replaceOwnerMinion':
        return targets.ownerMinions.map((minion) => ({ minion }));
    }
  }

  private play(cardId: string, target: TargetRef | undefined): Action {
    return target === undefined
      ? { kind: 'playCard', cardId }
      : { kind: 'playCard', cardId, target };
  }
}
