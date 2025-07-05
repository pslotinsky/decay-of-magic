import { Archive, DocumentQueryObject } from '@zok/domain/archive';
import { Document } from '@zok/domain/document';

export class FileSystemArchive extends Archive {
  public async count(query: DocumentQueryObject): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async find(query: DocumentQueryObject): Promise<Document[]> {
    throw new Error('Method not implemented.');
  }

  public async save(document: Document): Promise<Document> {
    throw new Error('Method not implemented.');
  }
}
