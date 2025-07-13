import { Remark } from '@zok/domain/entities';

import { DutyInstruction } from './DutyInstruction';

export class CreateDocumentDutyInstruction extends DutyInstruction {
  public async execute(): Promise<Remark> {
    const id = await this.assistants.archiveKeeper.issueDocumentNumber(
      this.protocol,
    );

    const document = await this.assistants.scribe.createDocument({
      id,
      plea: this.plea,
      protocol: this.protocol,
    });

    await this.assistants.archiveKeeper.save(document);

    return this.assistants.humorAdvisor.remarkOnDocumentCreation(document);
  }
}
