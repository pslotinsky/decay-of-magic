import { join } from 'node:path';

import nunjucks from 'nunjucks';
import prettier from 'prettier';
import { format } from 'date-fns';

import {
  Dossier,
  DocumentLink,
  DocumentMetadata,
  FieldDefinition,
  FieldType,
  Plea,
} from '@zok/domain/entities';
import { Scribe } from '@zok/domain/assistants';

const { ZOK_TEMPLATES_PATH = join(__dirname, '../../../config/templates') } =
  process.env;

export class NunjucksScribe extends Scribe {
  public readonly dossier = new Dossier({
    name: 'Mira',
    age: 26,
    race: 'Human',
    gender: 'female',
    bio: 'Firmly convinced she is destined to become the greatest author in history. Temporarily tolerates clerical work while awaiting recognition of her genius.',
  });

  private readonly env: nunjucks.Environment;

  constructor() {
    super();

    this.env = nunjucks.configure(ZOK_TEMPLATES_PATH, {
      autoescape: false,
    });

    this.env.addFilter('time', (date: Date) => date.toTimeString().slice(0, 8));
  }

  public async renderRecord(plea: Plea): Promise<string> {
    return this.env.render('plea-record.nj', { plea }).trim();
  }

  protected async fillDocumentContent(
    metadata: DocumentMetadata,
  ): Promise<string> {
    const { protocol } = metadata;
    const templateName = protocol.template;
    const fields = this.formatFields(metadata);
    const document = { ...metadata, fields };

    try {
      const raw = this.env.render(templateName, { document });

      return prettier.format(raw, { parser: 'markdown' });
    } catch (error) {
      throw new Error(
        `Failed to render document: ${metadata.id} with template: ${templateName} → ${error}`,
      );
    }
  }

  private formatFields(metadata: DocumentMetadata): Record<string, unknown> {
    const entries = Object.entries(metadata.fields).map(([key, value]) => {
      const field = metadata.protocol.getField(key);

      return [field.name, this.formatField(field, value)];
    });

    return Object.fromEntries(entries);
  }

  private formatField(field: FieldDefinition, value: unknown): string {
    switch (field.type) {
      case FieldType.Date:
        return format(value as Date, 'yyyy-MM-dd');
      case FieldType.Link:
        return value ? (value as DocumentLink).toString() : '';
      default:
        return value ? String(value) : '';
    }
  }
}
