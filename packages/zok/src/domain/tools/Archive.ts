import { Document } from '@zok/domain/entities';

export type DocumentQueryObject = {
  protocol: string;
  prefix?: string;
};

export abstract class Archive {
  public abstract count(query: DocumentQueryObject): Promise<number>;
  public abstract find(query: DocumentQueryObject): Promise<Document[]>;
  public abstract save(document: Document): Promise<Document>;
}
