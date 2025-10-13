import { Document, Remark } from '@zok/domain/entities';

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

    const parent = await this.getDocumentParent(document);

    return this.assistants.humorAdvisor.remarkOnDocumentRelationsUpdate(
      document,
      parent,
    );
  }

  private async getDocumentParent(
    _document: Document,
  ): Promise<Document | undefined> {
    return undefined;
  }
}
