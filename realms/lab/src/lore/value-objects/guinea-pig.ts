import { Character } from '../types';

/**
 * A configured player used inside Trials: a character plus its params. An
 * immutable value object, inlined per Protocol side. Constructed through the
 * per-character factories so invalid combinations (e.g. a depth on a
 * non-lookahead pig) cannot be represented.
 */
export class GuineaPig {
  private constructor(
    public readonly character: Character,
    public readonly depth?: number,
  ) {}

  public static random(): GuineaPig {
    return new GuineaPig(Character.Random);
  }

  public static greedy(): GuineaPig {
    return new GuineaPig(Character.Greedy);
  }

  public static lookahead(depth: number): GuineaPig {
    return new GuineaPig(Character.Lookahead, depth);
  }
}
