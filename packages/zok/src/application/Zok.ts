import {
  Binder,
  DocumentSeeker,
  HumorAdvisor,
  PleaDraft,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@zok/domain/assistants';
import { DocumentProtocol } from '@zok/domain/document';
import { Remark } from '@zok/domain/Remark';
import { Plea } from '@zok/domain/Plea';
import { PleaType } from '@zok/domain/PleaType';

import { CreateDocumentDutyInstruction, DutyInstruction } from './instructions';
import { ZokAssistants } from './ZokAssistants';

type NewZokAssistants = Partial<ZokAssistants> & {
  formalist: PleaFormalist;
  protocolClerk: ProtocolClerk;
};

export class Zok {
  private assistants: ZokAssistants;

  public static revealItself(assistants: NewZokAssistants): Zok {
    return new Zok({
      scribe: new Scribe(),
      binder: new Binder(),
      humorAdvisor: new HumorAdvisor(),
      seeker: new DocumentSeeker(),
      ...assistants,
    });
  }

  protected constructor(assistants: ZokAssistants) {
    this.assistants = assistants;
  }

  public async handleTextPlea(draft: PleaDraft): Promise<Remark> {
    const plea = await this.assistants.formalist.formalizePlea(draft);

    return this.handlePlea(plea);
  }

  public async handlePlea(plea: Plea): Promise<Remark> {
    const protocol = this.assistants.protocolClerk.getProtocol(plea);
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
        return new CreateDocumentDutyInstruction(this.assistants, plea);
      default:
        throw new Error(`Unknown plea type ${plea.type}`);
    }
  }
}
