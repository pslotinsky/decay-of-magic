import { Dossier } from '@zok/domain/entities';
import { ArchiveKeeper } from '@zok/domain/assistants';
import { Archive } from '@zok/domain/tools';
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
