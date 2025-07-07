import {
  ArchiveKeeper,
  Binder,
  HumorAdvisor,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@zok/domain/assistants';
import {
  DocumentProtocol,
  Remark,
  Plea,
  PleaDraft,
  PleaType,
} from '@zok/domain/entities';

import { CreateDocumentDutyInstruction, DutyInstruction } from './instructions';
import { ZokAssistants } from './ZokAssistants';

type NewZokAssistants = Partial<ZokAssistants> & {
  pleaFormalist: PleaFormalist;
  protocolClerk: ProtocolClerk;
  archiveKeeper: ArchiveKeeper;
  scribe: Scribe;
};

export class Zok {
  private assistants: ZokAssistants;

  public static revealItself(assistants: NewZokAssistants): Zok {
    return new Zok({
      binder: new Binder(),
      humorAdvisor: new HumorAdvisor(),
      ...assistants,
    });
  }

  protected constructor(assistants: ZokAssistants) {
    this.assistants = assistants;
  }

  public async handleTextPlea(draft: PleaDraft): Promise<Remark> {
    const plea = await this.assistants.pleaFormalist.formalizePlea(draft);

    return this.handlePlea(plea);
  }

  public async handlePlea(plea: Plea): Promise<Remark> {
    const protocol = this.assistants.protocolClerk.getProtocol(plea.protocol);
    const instruction = this.createDutyInstruction(plea, protocol);

    const remark = await instruction.execute();

    return remark;
  }

  public async init(): Promise<void> {
    for (const assistant of Object.values(this.assistants)) {
      await assistant.init();
    }
  }

  private createDutyInstruction(
    plea: Plea,
    protocol: DocumentProtocol,
  ): DutyInstruction {
    switch (plea.type) {
      case PleaType.Create:
        return new CreateDocumentDutyInstruction({
          plea,
          protocol,
          assistants: this.assistants,
        });
      default:
        throw new Error(`Unknown plea type ${plea.type}`);
    }
  }
}
