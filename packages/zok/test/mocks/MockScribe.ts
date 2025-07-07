import { format } from 'date-fns';

import { Scribe } from '@zok/domain/assistants';
import {
  DocumentMetadata,
  FieldDefinition,
  FieldType,
} from '@zok/domain/entities';

export class MockScribe extends Scribe {
  protected override fillDocumentContent(metadata: DocumentMetadata): string {
    const { id, title, fields, protocol } = metadata;

    return [
      `# ${id}: ${title}`,
      '',
      '| Field   | Value   |',
      '| ------- | ------- |',
      ...Object.entries(fields).map(([key, value]) => {
        const field = protocol.getField(key);

        return `| ${field.name} | ${this.formatFieldValue(field, value)} |`;
      }),
      '',
    ].join('\n');
  }

  private formatFieldValue(field: FieldDefinition, value: unknown): string {
    if (value === undefined) {
      return '';
    }

    const { type } = field;

    switch (type) {
      case FieldType.Date:
        return format(value as Date, 'yyyy-MM-dd');
      case FieldType.Enum:
        return value as string;
      case FieldType.Link:
        return value as string; // TODO: Link on document
      default:
        return value as string;
    }
  }
}
