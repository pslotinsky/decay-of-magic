import type { Feature } from './feature';

/**
 * The per-Universe set of features Criteria may weight. Hardcoded for MVP; its
 * eventual home is the Universe's Lab settings. Lab snapshots it at experiment
 * start, like Codex content, for reproducibility.
 */
export abstract class FeatureCatalog {
  public abstract list(universeId: string): Feature[];
}
