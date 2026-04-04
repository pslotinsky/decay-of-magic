import {
  Document,
  DocumentLink,
  DocumentProtocol,
  Remark,
} from '@zok/domain/entities';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface CreateDocumentDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class CreateDocumentDutyInstruction extends DutyInstruction<
  CreateDocumentDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    this.params = await this.enrichParams(this.params);

    const id = await this.assistants.archiveKeeper.issueDocumentNumber(
      this.params.protocol,
    );

    const document = await this.assistants.scribe.createDocument({
      id,
      plea: this.params.plea,
      protocol: this.params.protocol,
    });

    await this.assistants.archiveKeeper.save(document);

    return this.assistants.humorAdvisor.remarkOnDocumentCreation(document);
  }

  private async enrichParams(
    params: CreateDocumentDutyInstructionParams,
  ): Promise<CreateDocumentDutyInstructionParams> {
    const parentDocument = await this.resolveParentDocument(params.protocol);

    if (parentDocument) {
      this.params.plea.setValue('parent', DocumentLink.from(parentDocument));
    }

    return params;
  }

  private async resolveParentDocument(
    protocol: DocumentProtocol,
  ): Promise<Document | undefined> {
    const parentProtocolId = protocol.parentProtocolId;

    let result: Document | undefined = undefined;

    if (parentProtocolId) {
      const parentProtocol =
        this.assistants.protocolClerk.getProtocol(parentProtocolId);
      const parentId = this.params.plea.getValue<string>('parent');

      result = parentId
        ? await this.assistants.archiveKeeper.findById(parentProtocol, parentId)
        : await this.getActiveDocument(parentProtocol);
    }

    return result;
  }

  private async getActiveDocument(
    protocol: DocumentProtocol,
  ): Promise<Document | undefined> {
    const documents = await this.assistants.archiveKeeper.find({ protocol });

    return documents.find(
      (document) => document.getField('status') === 'In progress',
    );
  }
}
