import { Archive } from '@zok/domain/tools';
import { ArchiveKeeper } from '@zok/domain/assistants';
import { MockArchive } from './MockArchive';

export class MockArchiveKeeper extends ArchiveKeeper {
  protected createArchive(): Archive {
    return new MockArchive();
  }
}
