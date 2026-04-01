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

  public remarkOnDocumentList(documents: Document[]): Remark<Document[]> {
    const lines = documents.map((doc) => `- ${doc.id}: ${doc.title}`);
    const text = ['*Sigh* As you wish:', ...lines].join('\n');

    return new Remark(text, documents);
  }

  public remarkOnDocumentStatusChange(document: Document): Remark<Document> {
    const status = document.getField('status');

    return new Remark(
      `Document ${document.id} status changed to "${status}"`,
      document,
    );
  }

  public makeDummyRemark(): Remark {
    return new Remark('Dummy remark');
  }
}
