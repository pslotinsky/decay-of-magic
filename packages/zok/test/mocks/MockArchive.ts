import { isMatch } from 'lodash';

import { Archive, DocumentQueryObject } from '@zok/domain/archive';
import { Document } from '@zok/domain/document';

export class MockArchive extends Archive {
  private items: Record<string, Document> = {};

  public async count(query: DocumentQueryObject): Promise<number> {
    const items = await this.find(query);

    return items.length;
  }

  public async find(query: DocumentQueryObject): Promise<Document[]> {
    return Object.values(this.items).filter((item) => isMatch(item, query));
  }

  public async save(document: Document): Promise<Document> {
    this.items[document.id] = document;

    return document;
  }

  public reset(): void {
    this.items = {};
  }
}
