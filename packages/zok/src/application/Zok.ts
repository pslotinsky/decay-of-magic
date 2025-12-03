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
  Document,
} from '@zok/domain/entities';

import {
  CreateDocumentDutyInstruction,
  UpdateDocumentRelationsDutyInstruction,
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
    const protocol = this.assistants.protocolClerk.getProtocol(plea.protocol);

    switch (plea.type) {
      case PleaType.Create:
        return this.createDocument(plea, protocol) as any;
      default:
        throw new Error(`Unknown plea type ${plea.type}`);
    }
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

  private async createDocument(
    plea: Plea,
    protocol: DocumentProtocol,
  ): Promise<Remark<Document>> {
    const createDocumentDutyInstruction = new CreateDocumentDutyInstruction({
      plea,
      protocol,
      assistants: this.assistants,
    });

    const remark = await createDocumentDutyInstruction.execute();

    await this.updateDocumentRelations(plea, remark.result);

    return remark;
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
}
