import { Remark } from '@zok/domain/Remark';

import { DutyInstruction } from './DutyInstruction';

export class CreateDocumentDutyInstruction extends DutyInstruction {
  public async execute(): Promise<Remark> {
    throw new Error('Method not implemented.');
  }
}
