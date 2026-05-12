import { ArchiveKeeper } from '@/domain/assistants';
import { Dossier } from '@/domain/entities';
import { Archive } from '@/domain/tools';

import { MockArchive } from './MockArchive';

export class MockArchiveKeeper extends ArchiveKeeper {
  public readonly dossier = new Dossier({
    name: 'Puppet I',
    age: 0,
    race: 'Construct',
    gender: 'none',
    bio: 'A wooden cabinet with painted eyes. Does not exist outside of test runs. Has no feelings about this.',
  });

  protected createArchive(): Archive {
    return new MockArchive();
  }
}
