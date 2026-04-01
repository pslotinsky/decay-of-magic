import {
  Document,
  DocumentProtocol,
  FieldType,
  Remark,
} from '@zok/domain/entities';
import { NotFoundError, UnexpectedValueError } from '@zok/domain/errors';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface ChangeStatusDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class ChangeStatusDutyInstruction extends DutyInstruction<
  ChangeStatusDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    const document = await this.getDocument();
    const newStatusValue = this.resolveStatusValue();

    this.applyStatus(document, newStatusValue);

    await this.assistants.archiveKeeper.save(document);

    return this.assistants.humorAdvisor.remarkOnDocumentStatusChange(document);
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

  private applyStatus(document: Document, statusValue: string): void {
    document.metadata.fields.status = statusValue;
    document.content = this.replaceStatusInContent(
      document.content,
      statusValue,
    );
  }

  private replaceStatusInContent(content: string, statusValue: string): string {
    const statusFieldName = this.params.protocol.getField('status').name;

    return content.replace(
      new RegExp(`(\\| ${statusFieldName}\\s*\\|)[^|]*(\\|)`),
      `$1 ${statusValue} $2`,
    );
  }
}
