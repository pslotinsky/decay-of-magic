import {
  Document,
  DocumentLink,
  DocumentProtocol,
  Remark,
} from '@zok/domain/entities';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface RenameDocumentDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class RenameDocumentDutyInstruction extends DutyInstruction<
  RenameDocumentDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    const document = await this.getDocument(this.params.protocol);
    const title = this.params.plea.getValue<string>('title', document.title);
    const oldLink = DocumentLink.from(document);

    this.rename(document, title);

    await this.assistants.archiveKeeper.save(document);
    await this.updateChildLinks(document, oldLink);

    return this.assistants.humorAdvisor.remarkOnDocumentRename(document);
  }

  private rename(document: Document, newTitle: string): void {
    document.content = this.replaceTitleInContent(document, newTitle);
    document.metadata.title = newTitle;
  }

  private async updateChildLinks(
    document: Document,
    oldLink: DocumentLink,
  ): Promise<void> {
    const newLink = DocumentLink.from(document);
    const childProtocols = this.assistants.protocolClerk.getChildProtocols(
      document.protocol.id,
    );

    await Promise.all(
      childProtocols.map((protocol) =>
        this.assistants.archiveKeeper.replace(
          { protocol },
          oldLink.toString(),
          newLink.toString(),
        ),
      ),
    );
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
