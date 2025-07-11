import { Archive, DocumentQueryObject } from '@zok/domain/tools';
import { Document } from '@zok/domain/entities';

export class MockArchive extends Archive {
  private items: Record<string, Document> = {};

  public async count(query: DocumentQueryObject): Promise<number> {
    const items = await this.find(query);

    return items.length;
  }

  public async find(query: DocumentQueryObject): Promise<Document[]> {
    const { protocol, prefix } = query;

    let documents = Object.values(this.items).filter((document) =>
      document.followsProtocol(protocol),
    );

    if (prefix) {
      documents = documents.filter((document) =>
        document.id.startsWith(prefix),
      );
    }

    return documents;
  }

  public async save(document: Document): Promise<Document> {
    this.items[document.id] = document;

    return document;
  }
}
