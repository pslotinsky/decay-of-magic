import { startCase } from 'lodash';

import {
  Document,
  DocumentProtocol,
  DocumentToc,
  Remark,
} from '@zok/domain/entities';
import { DocumentTocRender } from '@zok/domain/tools';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';

interface UpdateReadmeDutyInstructionParams extends DutyInstructionParams {
  document: Document;
}

export class UpdateReadmeDutyInstruction extends DutyInstruction<UpdateReadmeDutyInstructionParams> {
  public async execute(): Promise<Remark> {
    const { document } = this.params;

    let readme = await this.getReadmeForProtocol(document.protocol);

    if (!readme) {
      readme = this.createReadmeForProtocol(document.protocol);
    }

    return this.updateReadme(readme);
  }

  private async getReadmeForProtocol(
    protocol: DocumentProtocol,
  ): Promise<Document | undefined> {
    const [readme] = await this.assistants.archiveKeeper.find({
      protocol,
      prefix: 'README',
    });

    return readme;
  }

  private createReadmeForProtocol(protocol: DocumentProtocol): Document {
    const title = startCase(protocol.aliases[0] ?? protocol.id);

    return Document.issue({
      metadata: { id: '', title, protocol, fields: {} },
      content: `# ${title}\n`,
    });
  }

  private async updateReadme(readme: Document): Promise<Remark> {
    const { document } = this.params;

    const documents = await this.getDocuments(document.protocol);

    const toc = this.createToc(document.protocol, documents);

    readme.content = this.replaceTocContent(readme.content, toc);

    await this.assistants.archiveKeeper.save(readme);

    return this.assistants.humorAdvisor.remarkOnReadmeUpdate(readme, document);
  }

  private async getDocuments(protocol: DocumentProtocol): Promise<Document[]> {
    const documents = await this.assistants.archiveKeeper.find({ protocol });

    return documents.filter((doc) => doc.id);
  }

  private createToc(
    protocol: DocumentProtocol,
    documents: Document[],
  ): DocumentToc {
    return {
      protocolName: protocol.id,
      lines: documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        link: `./${doc.fileName}`,
        status: doc.getField('status'),
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
        content.substring(0, tocStart) + tocContent + content.substring(tocEnd);
    } else {
      result = result.concat(`\n${tocContent}\n`);
    }

    return result;
  }
}
