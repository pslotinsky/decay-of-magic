import { Document, DocumentProtocol, Remark } from '@/domain/entities';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface DeleteDocumentDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class DeleteDocumentDutyInstruction extends DutyInstruction<
  DeleteDocumentDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    const document = await this.getDocument(this.params.protocol);

    await this.assistants.archiveKeeper.delete(document);

    return this.assistants.humorAdvisor.remarkOnDocumentDeletion(document);
  }
}
