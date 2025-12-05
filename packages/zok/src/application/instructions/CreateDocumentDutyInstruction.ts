import { DocumentProtocol, Remark, Document } from '@zok/domain/entities';

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
    const parentId = this.params.plea.getValue('parent')
      ? this.params.plea.getValue('parent')
      : await this.tryToFindParentDocument(params.protocol);

    if (parentId) {
      this.params.plea.setValue('parent', parentId);
    }

    return params;
  }

  private async tryToFindParentDocument(
    protocol: DocumentProtocol,
  ): Promise<string | undefined> {
    let result = undefined;
    const parentProtocolId = protocol.parentProtocolId;

    if (parentProtocolId) {
      const parentProtocol =
        this.assistants.protocolClerk.getProtocol(parentProtocolId);

      const activeDocument = await this.getActiveDocument(parentProtocol);

      result = activeDocument?.id;
    }

    return result;
  }

  private async getActiveDocument(
    protocol: DocumentProtocol,
  ): Promise<Document | undefined> {
    const documents = await this.assistants.archiveKeeper.find({
      protocol,
    });

    return documents.find(
      (document) => document.getField('status') === 'In progress',
    );
  }
}
