import { Archive } from '@zok/domain/archive';
import { ArchiveKeeper } from '@zok/domain/assistants';

import { FileSystemArchive } from '../archive';

export class FileSystemArchiveKeeper extends ArchiveKeeper {
  protected createArchive(): Archive {
    return new FileSystemArchive();
  }
}
