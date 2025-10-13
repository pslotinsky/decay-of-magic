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
}
