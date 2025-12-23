import { DocumentStatus, DocumentTocLine } from '@zok/domain/entities';
import { MalformedDocumentError } from '@zok/domain/errors';
import { TextExtractor } from './TextExtractor';

export class DocumentTocLineParser {
  private line: string;
  private status?: DocumentStatus;
  private label?: string;
  private link?: string;

  public static parse(line: string): DocumentTocLine {
    const parser = new DocumentTocLineParser(line);

    return parser.parse();
  }

  public constructor(line: string) {
    this.line = line.trim();
  }

  public parse(): DocumentTocLine {
    let text = this.extractStatus(this.line);
    text = this.extractLabel(text);
    text = this.extractLink(text);

    if (!this.label) {
      throw new MalformedDocumentError(
        `Can't parse toc line label from line: "${this.line}"`,
      );
    }

    if (!this.link) {
      throw new MalformedDocumentError(
        `Can't parse toc line link from line: "${this.line}"`,
      );
    }

    const [id, ...restLabelParts] = this.label.split(':');
    const title = restLabelParts.join(':').trim();

    return {
      id,
      title,
      link: this.link,
      status: this.status,
    };
  }

  private extractStatus(line: string): string {
    let resultLine = line;
    let extraction = TextExtractor.extractBetween(resultLine, '~~');

    if (extraction.extractedText) {
      this.status = DocumentStatus.Cancelled;
      resultLine = extraction.extractedText.trim();
    }

    extraction = TextExtractor.extractBetween(resultLine, '[', ']');

    if (extraction.extractedText === ' ') {
      this.status = this.status ?? DocumentStatus.InProgress;
      resultLine = extraction.remainingText.trim();
    }

    if (extraction.extractedText === 'x') {
      this.status = this.status ?? DocumentStatus.Done;
      resultLine = extraction.remainingText.trim();
    }

    return resultLine;
  }

  private extractLabel(line: string): string {
    const extraction = TextExtractor.extractBetween(line, '[', ']');

    this.label = extraction.extractedText;

    return extraction.remainingText;
  }

  private extractLink(line: string): string {
    const extraction = TextExtractor.extractBetween(line, '(', ')');

    this.link = extraction.extractedText;

    return extraction.remainingText;
  }
}
