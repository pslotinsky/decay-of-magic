import {
  Document,
  DocumentProtocol,
  DocumentToc,
  Remark,
} from '@zok/domain/entities';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';
import { join } from 'node:path';
import { DocumentTocRender } from '@zok/domain/tools';

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

    let parent = await this.getDocumentParent(document);

    if (parent) {
      parent = await this.updateToc(document, parent);
    }

    return this.assistants.humorAdvisor.remarkOnDocumentRelationsUpdate(
      document,
      parent,
    );
  }

  private async getDocumentParent(
    document: Document,
  ): Promise<Document | undefined> {
    let result = undefined;

    const parentId = document.getField('parent');
    const parentProtocolId = document.protocol.parentProtocolId;

    if (typeof parentId === 'string' && parentProtocolId) {
      const parentProtocol =
        this.assistants.protocolClerk.getProtocol(parentProtocolId);

      result = await this.getDocumentById(parentProtocol, parentId);
    }

    return result;
  }

  private async updateToc(
    document: Document,
    parent: Document,
  ): Promise<Document> {
    let files = await this.assistants.archiveKeeper.find({
      protocol: document.protocol,
      // TODO: parent: parent.id
    });

    files = files.filter((file) => file.getField('parent') === parent.id);

    parent.metadata.toc = this.createToc(document.protocol, files);
    parent.content = this.replaceTocContent(
      parent.content,
      parent.metadata.toc,
    );

    await this.assistants.archiveKeeper.save(parent);

    return parent;
  }

  private async getDocumentById(
    protocol: DocumentProtocol,
    id: string,
  ): Promise<Document | undefined> {
    const [document] = await this.assistants.archiveKeeper.find({
      protocol,
      prefix: id,
    });

    return document;
  }

  private createToc(
    protocol: DocumentProtocol,
    documents: Document[],
  ): DocumentToc {
    return {
      protocolName: protocol.id,
      lines: documents.map((document) => ({
        id: document.id,
        link: join('..', protocol.path, document.fileName),
        title: document.title,
        status: document.getField('status'),
      })),
    };
  }

  private replaceTocContent(content: string, toc: DocumentToc): string {
    let result = content;

    const tocContent = DocumentTocRender.render(toc);

    const openTag = DocumentTocRender.renderOpenTag(toc.protocolName);
    const tocStart = content.indexOf(openTag);

    if (tocStart > -1) {
      const closeTag = DocumentTocRender.renderCloseTag();
      const tocEnd = content.indexOf(closeTag, tocStart) + closeTag.length;

      result =
        content.substring(0, tocStart) +
        tocContent +
        content.substring(tocEnd, content.length);
    } else {
      result = result.concat(`${tocContent}\n`);
    }

    return result;
  }
}
