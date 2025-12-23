import {
  DocumentStatus,
  DocumentToc,
  DocumentTocLine,
} from '@zok/domain/entities';

export class DocumentTocRender {
  public static render(toc: DocumentToc): string {
    return new DocumentTocRender(toc).render();
  }

  public static renderOpenTag(protocolName: string): string {
    return `<!-- TOC.START: ${protocolName} -->`;
  }

  public static renderCloseTag(): string {
    return '<!-- TOC.END -->';
  }

  private toc: DocumentToc;

  protected constructor(toc: DocumentToc) {
    this.toc = toc;
  }

  public render(): string {
    return [
      DocumentTocRender.renderOpenTag(this.toc.protocolName),
      ...this.toc.lines.map((line) => this.renderLine(line)),
      DocumentTocRender.renderCloseTag(),
    ].join('\n');
  }

  private renderLine(line: DocumentTocLine): string {
    const text = `[${line.id}: ${line.title}](${line.link})`;

    switch (line.status) {
      case DocumentStatus.InProgress:
      case DocumentStatus.Planned:
        return `- [ ] ${text}`;
      case DocumentStatus.Done:
        return `- [x] ${text}`;
      case DocumentStatus.Cancelled:
        return `~~- [ ] ${text}~~`;
      default:
        return '';
    }
  }
}
