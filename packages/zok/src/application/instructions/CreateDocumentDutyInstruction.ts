import { Remark } from '@zok/domain/remark';

import { DutyInstruction } from './DutyInstruction';

export class CreateDocumentDutyInstruction extends DutyInstruction {
  public async execute(): Promise<Remark> {
    const id = await this.assistants.archiveKeeper.issueDocumentNumber(
      this.protocol,
    );

    const document = this.assistants.scribe.createDocument({
      id,
      plea: this.plea,
      protocol: this.protocol,
    });

    return this.assistants.humorAdvisor.remarkOnDocumentCreation(document);
  }
}
