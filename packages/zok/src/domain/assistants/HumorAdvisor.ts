import { Document, Remark } from '../entities';
import { Assistant } from './Assistant';

export class HumorAdvisor extends Assistant {
  public remarkOnDocumentCreation(document: Document): Remark<Document> {
    return new Remark(`Document ${document.id} created`, document);
  }

  public remarkOnDocumentRelationsUpdate(
    document: Document,
    parent?: Document,
  ): Remark<Document | undefined> {
    return parent
      ? new Remark(
          `Document ${parent.id} updated as relation of ${document.id}`,
          parent,
        )
      : new Remark(`No relations to update for document ${document.id}`);
  }
}
