import { Archive } from '@zok/domain/archive';
import { ArchiveKeeper } from '@zok/domain/assistants';
import { MockArchive } from './MockArchive';

export class MockArchiveKeeper extends ArchiveKeeper {
  public reset(): void {
    (this.archive as MockArchive).reset();
  }

  protected createArchive(): Archive {
    return new MockArchive();
  }
}
