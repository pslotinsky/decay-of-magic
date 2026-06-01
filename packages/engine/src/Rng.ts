import { uniformInt } from 'pure-rand/distribution/uniformInt';
import { xoroshiro128plus } from 'pure-rand/generator/xoroshiro128plus';
import type { RandomGenerator } from 'pure-rand/types/RandomGenerator';

function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * The engine's random source: a seeded xoroshiro128+ generator. Deterministic
 * and cloneable, so matches replay from a seed and fork for look-ahead.
 */
export class Rng {
  public static fromSeed(seed: string): Rng {
    return new Rng(xoroshiro128plus(hashSeed(seed)));
  }

  private constructor(private readonly generator: RandomGenerator) {}

  public nextInt(max: number): number {
    return uniformInt(this.generator, 0, max - 1);
  }

  public next(): number {
    return (this.generator.next() >>> 0) / 0x100000000;
  }

  public clone(): Rng {
    return new Rng(this.generator.clone());
  }

  public shuffle<T>(items: T[]): void {
    for (let index = items.length - 1; index > 0; index--) {
      const swap = this.nextInt(index + 1);
      [items[index], items[swap]] = [items[swap], items[index]];
    }
  }
}
