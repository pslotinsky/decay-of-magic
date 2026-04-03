import { Dossier } from '@zok/domain/entities';
import { Archive } from '@zok/domain/tools';
import { ArchiveKeeper } from '@zok/domain/assistants';

import { FileSystemArchive } from '../archive';

export class FileSystemArchiveKeeper extends ArchiveKeeper {
  public readonly dossier = new Dossier({
    name: 'Eolan',
    age: 287,
    race: 'Elf',
    gender: 'male',
    bio: 'Ancient, calm, and slightly detached from the present moment. May forget what happened yesterday, yet remembers the exact location of any volume. Treats the archive as a living ecosystem.',
  });

  protected createArchive(): Archive {
    return new FileSystemArchive();
  }
}
