import nunjucks from 'nunjucks';
import prettier from 'prettier';
import { format } from 'date-fns';

import { Scribe } from '@zok/domain/assistants';
import {
  DocumentMetadata,
  FieldDefinition,
  FieldType,
} from '@zok/domain/entities';

const { ZOK_TEMPLATES_PATH = './config/templates' } = process.env;

export class NunjucksScribe extends Scribe {
  private readonly env: nunjucks.Environment;

  constructor() {
    super();

    this.env = nunjucks.configure(ZOK_TEMPLATES_PATH, {
      autoescape: false,
    });
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
      default:
        return value ? String(value) : '';
    }
  }
}
