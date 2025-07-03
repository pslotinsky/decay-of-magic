import { nanoid } from 'nanoid';

import { PleaFormalist } from '@zok/domain/assistants';

const NANOID_SIZE = 6;

export class NanoPleaFormalist extends PleaFormalist {
  protected override async issueId(): Promise<string> {
    return nanoid(NANOID_SIZE);
  }
}
