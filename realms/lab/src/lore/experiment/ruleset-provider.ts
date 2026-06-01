import type { RulesetDto } from '@dod/engine';

/**
 * Supplies the engine ruleset a Universe runs under (slots, hand and draw
 * sizes). Rules are inherited from the Universe in MVP; the Protocol overrides
 * only the turn-limit guard.
 */
export abstract class RulesetProvider {
  public abstract get(universeId: string): Promise<RulesetDto>;
}
