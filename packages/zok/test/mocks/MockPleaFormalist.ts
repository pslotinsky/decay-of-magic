import { Dossier } from '@zok/domain/entities';
import { PleaFormalist } from '@zok/domain/assistants';

export class MockPleaFormalist extends PleaFormalist {
  public readonly dossier = new Dossier({
    name: 'Puppet II',
    age: 0,
    race: 'Construct',
    gender: 'none',
    bio: 'A rubber stamp that talks. Assigned to training exercises when real personnel are unavailable.',
  });

  private count: number = 0;

  protected override async issueId(): Promise<string> {
    this.count += 1;

    return this.count.toString();
  }
}
