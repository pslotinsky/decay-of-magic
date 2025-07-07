import { DocumentProtocol, Remark, Plea } from '@zok/domain/entities';

import { ZokAssistants } from '../ZokAssistants';

type DutyInstructionParams = {
  assistants: ZokAssistants;
  plea: Plea;
  protocol: DocumentProtocol;
};

export abstract class DutyInstruction {
  public readonly assistants: ZokAssistants;
  public readonly plea: Plea;
  public readonly protocol: DocumentProtocol;

  constructor(params: DutyInstructionParams) {
    this.assistants = params.assistants;
    this.plea = params.plea;
    this.protocol = params.protocol;
  }

  public abstract execute(): Promise<Remark>;
}
