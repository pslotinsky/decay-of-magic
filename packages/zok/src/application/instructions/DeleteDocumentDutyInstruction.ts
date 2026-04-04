import { Document, DocumentProtocol, Remark } from '@zok/domain/entities';
import { NotFoundError } from '@zok/domain/errors';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface DeleteDocumentDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class DeleteDocumentDutyInstruction extends DutyInstruction<
  DeleteDocumentDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    const document = await this.getDocument();

    await this.assistants.archiveKeeper.delete(document);

    return this.assistants.humorAdvisor.remarkOnDocumentDeletion(document);
  }

  private async getDocument(): Promise<Document> {
    const { protocol, plea } = this.params;
    const id = plea.getValue<string>('id');
    const [document] = await this.assistants.archiveKeeper.find({
      protocol,
      prefix: id,
    });

    if (!document) {
      throw new NotFoundError('Document', { id, protocol: protocol.id });
    }

    return document;
  }
}
