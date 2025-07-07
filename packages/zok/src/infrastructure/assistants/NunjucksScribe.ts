import { Scribe } from '@zok/domain/assistants';
import { DocumentMetadata } from '@zok/domain/entities';

export class NunjucksScribe extends Scribe {
  protected fillDocumentContent(metadata: DocumentMetadata): string {
    throw new Error('Method not implemented.');
  }
}
