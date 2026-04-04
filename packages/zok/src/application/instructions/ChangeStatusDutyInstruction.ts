import {
  Document,
  DocumentProtocol,
  FieldType,
  Remark,
} from '@zok/domain/entities';
import { UnexpectedValueError } from '@zok/domain/errors';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface ChangeStatusDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class ChangeStatusDutyInstruction extends DutyInstruction<
  ChangeStatusDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    const document = await this.getDocument(this.params.protocol);
    document.setField('status', this.resolveStatusValue());

    await this.assistants.archiveKeeper.save(document);

    return this.assistants.humorAdvisor.remarkOnDocumentStatusChange(document);
  }

  private resolveStatusValue(): string {
    const { protocol, plea } = this.params;
    const statusKey = plea.getValue<string>('status');
    const field = protocol.getField('status');

    if (field.type !== FieldType.Enum) {
      throw new UnexpectedValueError(
        field.type,
        `Status field must be an enum for protocol ${protocol.id}`,
      );
    }

    const values = field.values as unknown as Record<string, string>;
    const value = values[statusKey ?? ''];

    if (!value) {
      throw new UnexpectedValueError(
        statusKey,
        `Unknown status key for protocol ${protocol.id}`,
      );
    }

    return value;
  }
}
