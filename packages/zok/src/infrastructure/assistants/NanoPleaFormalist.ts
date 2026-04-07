import { nanoid } from 'nanoid';

import { Dossier } from '@zok/domain/entities';
import { PleaFormalist } from '@zok/domain/assistants';

const NANOID_SIZE = 6;

export class NanoPleaFormalist extends PleaFormalist {
  public readonly dossier = new Dossier({
    name: 'Skrit',
    age: 39,
    race: 'Goblin',
    gender: 'female',
    bio: 'Lives for argument. Thrives on objection. Delights in prolonged disputes conducted in increasingly technical language. Ultimately ensures every petition is accepted — but only after sufficient resistance.',
  });

  protected override issueId(): Promise<string> {
    return Promise.resolve(nanoid(NANOID_SIZE));
  }
}
