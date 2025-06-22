import { Plea } from '@zok/domain/Plea';
import { Remark } from '@zok/domain/Remark';

import { ZokAssistants } from '../ZokAssistants';

export abstract class DutyInstruction {
  constructor(
    public readonly assistants: ZokAssistants,
    public readonly plea: Plea,
  ) {}

  public abstract execute(): Promise<Remark>;
}
