import type { CodexContentDto } from '@dod/engine';

/**
 * Loads a Universe's Codex content (Cards, Heroes, dictionaries) for snapshot
 * at experiment start. Lab consumes Codex; the impl reads the Codex realm.
 */
export abstract class CodexContentProvider {
  public abstract get(universeId: string): Promise<CodexContentDto>;
}
