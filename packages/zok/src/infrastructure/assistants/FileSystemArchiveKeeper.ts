import { Archive } from '@zok/domain/tools';
import { ArchiveKeeper } from '@zok/domain/assistants';

import { FileSystemArchive } from '../archive';

export class FileSystemArchiveKeeper extends ArchiveKeeper {
  protected createArchive(): Archive {
    return new FileSystemArchive();
  }
}
