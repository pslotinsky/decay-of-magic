import { DocumentToc } from '@zok/domain/entities';
import { MalformedDocumentError } from '@zok/domain/errors';
import { DocumentTocLineParser } from './DocumentTocLineParser';

export class DocumentTocParser {
  private readonly content: string;

  public static parse(content: string): DocumentToc | undefined {
    const parser = new DocumentTocParser(content);

    return parser.parse();
  }

  public constructor(content: string) {
    this.content = content;
  }

  public parse(): DocumentToc | undefined {
    let toc = undefined;
    const lines = this.content.split('\n').map((item) => item.trim());
    const startIndex = lines.findIndex((line) =>
      line.startsWith('<!-- TOC.START'),
    );
    const endIndex = lines.findIndex((line) => line.startsWith('<!-- TOC.END'));

    if (startIndex > 0 && endIndex > startIndex) {
      const [startLine, ...tocLines] = lines.slice(startIndex, endIndex);

      toc = {
        protocolName: this.parseTocProtocolName(startLine),
        lines: tocLines.map(DocumentTocLineParser.parse),
      };
    }

    return toc;
  }

  private parseTocProtocolName(line: string): string {
    const match = line.match(/<!-- TOC.START: ([a-zA-Z0-9_-]+) -->/);
    const protocolName = match?.[1];

    if (!protocolName) {
      throw new MalformedDocumentError(
        `Can't parse toc protocol name from line: "${line}"`,
      );
    }

    return protocolName;
  }
}
