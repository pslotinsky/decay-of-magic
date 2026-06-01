import type { BattleEvent } from '@dod/engine';

/**
 * Buffers the engine events emitted between drains. `drain` returns everything
 * recorded since the previous drain and clears the buffer in one step, so a
 * caller captures exactly one action's event delta without juggling the buffer.
 */
export class EventRecorder {
  private buffer: BattleEvent[] = [];

  public record(event: BattleEvent): void {
    this.buffer.push(event);
  }

  public drain(): BattleEvent[] {
    const drained = this.buffer;
    this.buffer = [];
    return drained;
  }
}
