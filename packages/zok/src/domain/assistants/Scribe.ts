import {
  Document,
  DocumentMetadata,
  DocumentProtocol,
  Plea,
} from '../entities';
import { Assistant } from './Assistant';

type CreateDocumentParams = {
  id: string;
  plea: Plea;
  protocol: DocumentProtocol;
};

const DEFAULT_NAME = 'Untitled';

export abstract class Scribe extends Assistant {
  public createDocument(params: CreateDocumentParams): Document {
    const { id, plea, protocol } = params;

    const metadata = {
      id,
      protocol,
      title: plea.getValue<string>('title', DEFAULT_NAME),
      fields: this.fillDocumentFields(protocol, plea),
    };

    return Document.issue({
      metadata,
      content: this.fillDocumentContent(metadata),
    });
  }

  protected fillDocumentFields(
    protocol: DocumentProtocol,
    plea: Plea,
  ): Record<string, unknown> {
    const fields: Record<string, unknown> = {};
    const defaultValues = this.getDefaultFieldValues();
    let value;

    for (const [key, _fieldDefinition] of Object.entries(protocol.fields)) {
      value = plea.getValue(key, defaultValues[key]);

      fields[key] = protocol.normalizeFieldValue(key, value);
      // TODO: fields[key] = fieldDefinition.normalizeValue(value);
    }

    return fields;
  }

  protected getDefaultFieldValues(): Record<string, unknown> {
    return {
      status: 'In progress',
      created: new Date(),
    };
  }

  protected abstract fillDocumentContent(metadata: DocumentMetadata): string;
}
