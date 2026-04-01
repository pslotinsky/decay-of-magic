import { Document, DocumentProtocol, Remark } from '@zok/domain/entities';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface ListDocumentsDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class ListDocumentsDutyInstruction extends DutyInstruction<
  ListDocumentsDutyInstructionParams,
  Document[]
> {
  public async execute(): Promise<Remark<Document[]>> {
    const documents = await this.getDocuments();

    return this.assistants.humorAdvisor.remarkOnDocumentList(documents);
  }

  private async getDocuments(): Promise<Document[]> {
    const documents = await this.assistants.archiveKeeper.find({
      protocol: this.params.protocol,
    });

    return documents.filter((doc) => doc.id);
  }
}
