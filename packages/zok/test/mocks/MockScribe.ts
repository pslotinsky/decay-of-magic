import { format } from 'date-fns';

import { Scribe } from '@/domain/assistants';
import {
  DocumentLink,
  DocumentMetadata,
  Dossier,
  FieldDefinition,
  FieldType,
  Plea,
} from '@/domain/entities';

export class MockScribe extends Scribe {
  public readonly dossier = new Dossier({
    name: 'Puppet IV',
    age: 0,
    race: 'Construct',
    gender: 'none',
    bio: 'A mechanical arm with a quill attached. Writes exactly what it is told. Does not embellish.',
  });

  // eslint-disable-next-line @typescript-eslint/require-await
  public async renderRecord(_plea: Plea): Promise<string> {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected override async fillDocumentContent(
    metadata: DocumentMetadata,
  ): Promise<string> {
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

    switch (field.type) {
      case FieldType.Date:
        return format(value as Date, 'yyyy-MM-dd');
      case FieldType.Enum:
        return value as string;
      case FieldType.Link:
        return value ? (value as DocumentLink).toString() : '';
      default:
        return value as string;
    }
  }
}
