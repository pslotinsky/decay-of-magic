import { Document, DocumentProtocol } from '@zok/domain/entities';

import { DocumentParser } from './parser/DocumentParser';

export type DocumentQueryObject = {
  protocol: DocumentProtocol;
  prefix?: string;
};

export abstract class Archive {
  protected readonly documentParser: DocumentParser = new DocumentParser();

  public abstract count(query: DocumentQueryObject): Promise<number>;
  public abstract find(query: DocumentQueryObject): Promise<Document[]>;
  public abstract save(document: Document): Promise<Document>;
}
