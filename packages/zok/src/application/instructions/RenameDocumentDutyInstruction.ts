import { Document, DocumentProtocol, Remark } from '@zok/domain/entities';
import { NotFoundError } from '@zok/domain/errors';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface RenameDocumentDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class RenameDocumentDutyInstruction extends DutyInstruction<
  RenameDocumentDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    const document = await this.getDocument();
    const title = this.params.plea.getValue<string>('title', document.title);

    this.rename(document, title);

    await this.assistants.archiveKeeper.save(document);

    return this.assistants.humorAdvisor.remarkOnDocumentRename(document);
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

  private rename(document: Document, newTitle: string): void {
    document.content = this.replaceTitleInContent(document, newTitle);
    document.metadata.title = newTitle;
  }

  private replaceTitleInContent(document: Document, newTitle: string): string {
    return document.content.replace(
      this.buildHeading(document.id, document.title),
      this.buildHeading(document.id, newTitle),
    );
  }

  private buildHeading(id: string, title: string): string {
    return id ? `# ${id}: ${title}` : `# ${title}`;
  }
}
