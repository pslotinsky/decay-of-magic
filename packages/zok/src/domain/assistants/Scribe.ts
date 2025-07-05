import { Document, DocumentProtocol } from '../document';
import { Plea } from '../plea';
import { Assistant } from './Assistant';

type CreateDocumentParams = {
  id: string;
  plea: Plea;
  protocol: DocumentProtocol;
};

const DEFAULT_NAME = 'Untitled';

export class Scribe extends Assistant {
  public createDocument(params: CreateDocumentParams): Document {
    return new Document({
      id: params.id,
      name: params.plea.getValue<string>('title', DEFAULT_NAME),
      protocol: params.protocol,
    });
  }
}
