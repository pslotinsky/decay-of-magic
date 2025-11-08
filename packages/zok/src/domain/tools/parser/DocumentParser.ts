import { compact } from 'lodash';

import {
  Document,
  DocumentMetadata,
  DocumentProtocol,
  DocumentToc,
  FieldType,
} from '../../entities';
import { MalformedDocumentError, UnexpectedValueError } from '../../errors';
import { DocumentTocParser } from './DocumentTocParser';

export class DocumentParser {
  public parse(protocol: DocumentProtocol, content: string): Document {
    return Document.issue({
      content,
      metadata: this.parseMetadata(protocol, content),
    });
  }

  private parseMetadata(
    protocol: DocumentProtocol,
    content: string,
  ): DocumentMetadata {
    const [titleSection, fieldsSection] = this.splitOnSections(content);

    const [id, title] = this.parseIdAndTitle(titleSection);

    return {
      id,
      title,
      protocol,
      fields: this.parseFields(protocol, fieldsSection),
      toc: this.parseToc(content),
    };
  }

  private parseIdAndTitle(text: string): string[] {
    const [idPart, titlePart] = text.split(':');

    const id = idPart?.replace('# ', '').trim();
    const title = titlePart?.trim();

    if (!id) {
      throw new MalformedDocumentError(`Can't parse id from line: "${text}"`);
    }

    if (!title) {
      throw new MalformedDocumentError(
        `Can't parse title from line: "${text}"`,
      );
    }

    return [id, title];
  }

  private parseFields(
    protocol: DocumentProtocol,
    lines: string[],
  ): Record<string, unknown> {
    const entries = lines.map((line) => this.parseField(protocol, line));

    return Object.fromEntries(entries);
  }

  private parseToc(content: string): DocumentToc | undefined {
    return DocumentTocParser.parse(content);
  }

  private parseField(
    protocol: DocumentProtocol,
    line: string,
  ): [string, unknown] {
    const [namePart, ...restParts] = compact(line.split('|'));

    if (!namePart) {
      throw new MalformedDocumentError(
        `Can't parse metadata field. Name not found in line: "${line}"`,
      );
    }

    const name = namePart.trim();
    const key = protocol.findFieldKeyByName(name);
    const field = protocol.getField(key);

    let value = undefined;
    const valueString = restParts.join('|').trim();

    if (valueString) {
      switch (field.type) {
        case FieldType.Date:
          value = this.parseDateField(valueString);
          break;
        default:
          value = valueString;
      }
    }

    return [key, value];
  }

  private parseDateField(valueString: string): Date {
    const date = new Date(valueString);

    if (isNaN(date.getTime())) {
      throw new UnexpectedValueError(
        valueString,
        `Field value is invalid date`,
      );
    }

    return date;
  }

  private splitOnSections(content: string): [string, string[]] {
    const [firstLine, ...restLines] = content.trim().split('\n');

    return [
      this.fetchTitleSection(firstLine),
      this.fetchFieldsSection(restLines),
    ];
  }

  private fetchTitleSection(titleLine?: string): string {
    if (!titleLine) {
      throw new MalformedDocumentError("Can't parse title. Document is empty");
    }

    if (!titleLine.startsWith('# ')) {
      throw new MalformedDocumentError(
        `Can't parse title. Title must be started with "# "`,
      );
    }

    return titleLine;
  }

  private fetchFieldsSection(lines: string[]): string[] {
    let startIndex = lines.findIndex((line) => line.startsWith('| Field'));

    if (startIndex === -1) {
      return [];
    }

    startIndex++;

    if (!lines[startIndex]?.startsWith('| -----')) {
      throw new MalformedDocumentError(
        `Can't parse fields. Can't read table header`,
      );
    }

    startIndex++;

    let endIndex = startIndex;

    while (endIndex < lines.length && lines[endIndex].startsWith('| ')) {
      endIndex += 1;
    }

    return lines.slice(startIndex, endIndex);
  }
}
