import { DocumentProtocol } from '../document';
import { Plea } from '../plea';
import { Assistant } from './Assistant';

type CreateDocumentParams = {
  id: string;
  plea: Plea;
  protocol: DocumentProtocol;
};

export class Scribe extends Assistant {
  public createDocument(params: CreateDocumentParams): Document {
    throw new Error('Method not implemented.');
  }
}
