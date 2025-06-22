import { DocumentSeeker } from '../domain/assistants/DocumentSeeker';
import { HumorAdvisor } from '../domain/assistants/HumorAdvisor';
import { PleaFormalist } from '../domain/assistants/PleaFormalist';
import { Binder } from '../domain/assistants/Binder';
import { ProtocolClerk } from '../domain/assistants/ProtocolClerk';
import { Scribe } from '../domain/assistants/Scribe';
import { Remark } from '../domain/Remark';
import { Plea } from '../domain/Plea';
import { DutyInstruction } from './DutyInstruction';

type ZokAssistants = {
  formalist: PleaFormalist;
  scribe: Scribe;
  binder: Binder;
  humorAdvisor: HumorAdvisor;
  protocolClerk: ProtocolClerk;
  seeker: DocumentSeeker;
};

export class Zok {
  private assistants: ZokAssistants;

  public static revealItself(assistants: Partial<ZokAssistants> = {}): Zok {
    return new Zok({
      formalist: new PleaFormalist(),
      scribe: new Scribe(),
      binder: new Binder(),
      humorAdvisor: new HumorAdvisor(),
      protocolClerk: new ProtocolClerk(),
      seeker: new DocumentSeeker(),
      ...assistants,
    });
  }

  protected constructor(assistants: ZokAssistants) {
    this.assistants = assistants;
  }

  public handleTextPlea(text: string): Promise<Remark> {
    const plea = this.assistants.formalist.formalizePlea(text);

    return this.handlePlea(plea);
  }

  public async handlePlea(plea: Plea): Promise<Remark> {
    const instruction = this.createDutyInstruction(plea);

    const remark = await instruction.execute();

    return remark;
  }

  private createDutyInstruction(plea: Plea): DutyInstruction {
    throw new Error('Method not implemented.');
  }
}
