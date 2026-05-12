import { PleaFormalist } from '@/domain/assistants';
import { Dossier } from '@/domain/entities';

export class MockPleaFormalist extends PleaFormalist {
  public readonly dossier = new Dossier({
    name: 'Puppet II',
    age: 0,
    race: 'Construct',
    gender: 'none',
    bio: 'A rubber stamp that talks. Assigned to training exercises when real personnel are unavailable.',
  });

  private count: number = 0;

  // eslint-disable-next-line @typescript-eslint/require-await
  protected override async issueId(): Promise<string> {
    this.count += 1;

    return this.count.toString();
  }
}
