import {
  ArchiveKeeper,
  Binder,
  HumorAdvisor,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@zok/domain/assistants';
import {
  Remark,
  Plea,
  PleaDraft,
  PleaType,
  Document,
} from '@zok/domain/entities';

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

type PleaHandlingResult<T extends PleaType> = PleaHandlingResultMap[T];

interface PleaHandlingResultMap {
  [PleaType.Create]: Remark<Document>;
  [PleaType.Rename]: Remark<Document>;
  [PleaType.ChangeStatus]: Remark<Document>;
  [PleaType.List]: Remark<Document[]>;
  [PleaType.Unknown]: Remark<unknown>;
}

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

  public async handleTextPlea<T extends PleaType>(
    draft: Typed<PleaDraft, T>,
  ): Promise<PleaHandlingResult<T>> {
    const plea = await this.assistants.pleaFormalist.formalizePlea(draft);

    return this.handlePlea(plea as Typed<Plea, T>);
  }

  public async handlePlea<T extends PleaType>(
    plea: Typed<Plea, T>,
  ): Promise<PleaHandlingResult<T>> {
    let result;

    const protocol = this.assistants.protocolClerk.getProtocol(plea.protocol);
    const assistants = this.assistants;

    switch (plea.type) {
      case PleaType.Create:
        result = this.executeCommand(
          new CreateDocumentDutyInstruction({ plea, protocol, assistants }),
        );
        break;
      case PleaType.Rename:
        result = this.executeCommand(
          new RenameDocumentDutyInstruction({ plea, protocol, assistants }),
        );
        break;
      case PleaType.ChangeStatus:
        result = this.executeCommand(
          new ChangeStatusDutyInstruction({ plea, protocol, assistants }),
        );
        break;
      case PleaType.List:
        result = this.executeQuery(
          new ListDocumentsDutyInstruction({ plea, protocol, assistants }),
        );
        break;
      default:
        result = this.assistants.humorAdvisor.makeDummyRemark();
    }

    return result as unknown as PleaHandlingResult<T>;
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
    const remark = await instruction.execute();

    await this.updateDocumentRelations(instruction.plea, remark.result);
    await this.updateReadme(instruction.plea, remark.result);

    return remark;
  }

  private executeQuery<T>(
    instruction: DutyInstruction<DutyInstructionParams, T>,
  ): Promise<Remark<T>> {
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
}
