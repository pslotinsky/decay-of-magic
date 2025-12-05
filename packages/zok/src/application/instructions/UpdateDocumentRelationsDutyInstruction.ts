import { Document, DocumentProtocol, Remark } from '@zok/domain/entities';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface UpdateDocumentRelationsDutyInstructionParams
  extends DutyInstructionParams {
  document: Document;
}

export class UpdateDocumentRelationsDutyInstruction extends DutyInstruction<
  UpdateDocumentRelationsDutyInstructionParams,
  Document | undefined
> {
  public async execute(): Promise<Remark<Document | undefined>> {
    const { document } = this.params;

    let parent = await this.getDocumentParent(document);

    if (parent) {
      parent = await this.updateToc(parent);
    }

    return this.assistants.humorAdvisor.remarkOnDocumentRelationsUpdate(
      document,
      parent,
    );
  }

  private async getDocumentParent(
    document: Document,
  ): Promise<Document | undefined> {
    let result = undefined;

    const parentId = document.getField('parent');
    const parentProtocolId = document.protocol.parentProtocolId;

    if (typeof parentId === 'string' && parentProtocolId) {
      const parentProtocol =
        this.assistants.protocolClerk.getProtocol(parentProtocolId);

      result = await this.getDocumentById(parentProtocol, parentId);
    }

    return result;
  }

  private async updateToc(parent: Document): Promise<Document> {
    // TODO: Update ToC
    return parent;
  }

  private async getDocumentById(
    protocol: DocumentProtocol,
    id: string,
  ): Promise<Document | undefined> {
    const [document] = await this.assistants.archiveKeeper.find({
      protocol,
      prefix: id,
    });

    return document;
  }
}
