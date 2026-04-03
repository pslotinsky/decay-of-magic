import {
  Dossier,
  Remark,
  Plea,
  PleaDraft,
  PleaType,
  Document,
} from '@zok/domain/entities';
import { pleaContext } from '@zok/domain/PleaContext';
import {
  ArchiveKeeper,
  HumorAdvisor,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@zok/domain/assistants';

import {
  ChangeStatusDutyInstruction,
  CreateDocumentDutyInstruction,
  DutyInstruction,
  DutyInstructionParams,
  ListDocumentsDutyInstruction,
  RenameDocumentDutyInstruction,
  UpdateDocumentRelationsDutyInstruction,
  UpdateReadmeDutyInstruction,
} from './instructions';
import { ZokAssistants } from './ZokAssistants';

type NewZokAssistants = Partial<ZokAssistants> & {
  pleaFormalist: PleaFormalist;
  protocolClerk: ProtocolClerk;
  archiveKeeper: ArchiveKeeper;
  scribe: Scribe;
};

type Typed<E, T extends PleaType> = E & { type: T };

type PleaHandlingResultMap = {
  [PleaType.Create]: Remark<Document>;
  [PleaType.Rename]: Remark<Document>;
  [PleaType.ChangeStatus]: Remark<Document>;
  [PleaType.List]: Remark<Document[]>;
  [PleaType.Unknown]: Remark<unknown>;
};

export type ZokResult<T extends PleaType> = {
  plea: Plea;
  remark: PleaHandlingResultMap[T];
};

export class Zok {
  public readonly title = 'Arzivarius';

  public readonly dossier = new Dossier({
    name: 'Zok',
    age: 127,
    race: 'Orc',
    gender: 'male',
    bio: 'Significantly smarter than his visitors, and knows it for sure. Forced to humbly endure their stupid wishes. Always fulfills them exactly, and is never wrong. His tired face always shows that he does not think much of you. He could hide it, but does not consider it necessary. Does not accept commands. Only pleas.',
  });

  public readonly assistants: ZokAssistants;

  public static revealItself(assistants: NewZokAssistants): Zok {
    return new Zok({
      humorAdvisor: new HumorAdvisor(),
      ...assistants,
    });
  }

  protected constructor(assistants: ZokAssistants) {
    this.assistants = assistants;
  }

  public async handleTextPlea<T extends PleaType>(
    draft: Typed<PleaDraft, T>,
  ): Promise<ZokResult<T>> {
    const plea = await this.assistants.pleaFormalist.formalizePlea(draft);

    return this.handlePlea(plea as Typed<Plea, T>);
  }

  public async handlePlea<T extends PleaType>(
    plea: Typed<Plea, T>,
  ): Promise<ZokResult<T>> {
    return pleaContext.run(plea, async () => {
      const protocol = this.assistants.protocolClerk.getProtocol(plea.protocol);

      const assistants = this.assistants;
      let remark;

      switch (plea.type) {
        case PleaType.Create:
          remark = await this.executeCommand(
            new CreateDocumentDutyInstruction({ plea, protocol, assistants }),
          );
          break;
        case PleaType.Rename:
          remark = await this.executeCommand(
            new RenameDocumentDutyInstruction({ plea, protocol, assistants }),
          );
          break;
        case PleaType.ChangeStatus:
          remark = await this.executeCommand(
            new ChangeStatusDutyInstruction({ plea, protocol, assistants }),
          );
          break;
        case PleaType.List:
          remark = await this.executeQuery(
            new ListDocumentsDutyInstruction({ plea, protocol, assistants }),
          );
          break;
        default:
          remark = this.assistants.humorAdvisor.makeDummyRemark();
      }

      this.report(`Matter concluded. Response prepared for the petitioner.`);

      return { plea, remark: remark as PleaHandlingResultMap[T] };
    });
  }

  public async announce<T extends PleaType>(
    result: ZokResult<T>,
    record = false,
  ): Promise<void> {
    if (record) {
      console.info(await this.assistants.scribe.renderRecord(result.plea));
      console.info('');
    }
    console.info(result.remark.toString());
  }

  public async findDocuments(
    protocolName: string,
    prefix?: string,
  ): Promise<Document[]> {
    const protocol = this.assistants.protocolClerk.getProtocol(protocolName);

    return this.assistants.archiveKeeper.find({ protocol, prefix });
  }

  public async init(): Promise<void> {
    for (const assistant of Object.values(this.assistants)) {
      await assistant.init();
    }
  }

  private async executeCommand(
    instruction: DutyInstruction<DutyInstructionParams, Document>,
  ): Promise<Remark<Document>> {
    this.report(`Launching work instruction ${instruction.constructor.name}.`);

    const remark = await instruction.execute();

    await this.updateDocumentRelations(instruction.plea, remark.result);
    await this.updateReadme(instruction.plea, remark.result);

    return remark;
  }

  private async executeQuery<T>(
    instruction: DutyInstruction<DutyInstructionParams, T>,
  ): Promise<Remark<T>> {
    this.report(`Launching work instruction ${instruction.constructor.name}.`);

    return instruction.execute();
  }

  private async updateDocumentRelations(
    plea: Plea,
    document?: Document,
  ): Promise<void> {
    let instruction: UpdateDocumentRelationsDutyInstruction;
    let remark: Remark<Document | undefined>;

    for (
      let currentDocument = document;
      currentDocument instanceof Document;
      currentDocument = remark.result
    ) {
      instruction = new UpdateDocumentRelationsDutyInstruction({
        plea,
        document: currentDocument,
        assistants: this.assistants,
      });

      remark = await instruction.execute();
    }
  }

  private async updateReadme(plea: Plea, document?: Document): Promise<void> {
    if (document) {
      const instruction = new UpdateReadmeDutyInstruction({
        plea,
        document,
        assistants: this.assistants,
      });

      await instruction.execute();
    }
  }

  private report(note: string): void {
    pleaContext.getStore()?.addReport(this, note);
  }
}
