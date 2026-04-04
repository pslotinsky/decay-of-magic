import { Dossier, Document, Remark } from '../entities';
import { Assistant } from './Assistant';

export class HumorAdvisor extends Assistant {
  public readonly title = 'Humor Advisor';

  public readonly dossier = new Dossier({
    name: 'Selene',
    age: 143,
    race: 'Succubus',
    gender: 'female',
    bio: 'Perpetually unimpressed. Rarely entertained. Produces refined remarks balanced precisely between wit and professional safety.',
  });

  public remarkOnDocumentDeletion(document: Document): Remark<Document> {
    const remark = new Remark(`Document ${document.id} expunged.`, document);
    this.report(`Remark drafted: ${remark.text}.`);
    return remark;
  }

  public remarkOnDocumentCreation(document: Document): Remark<Document> {
    const remark = new Remark(`Document ${document.id} created`, document);
    this.report(`Remark drafted: ${remark.text}.`);
    return remark;
  }

  public remarkOnDocumentRelationsUpdate(
    document: Document,
    parent?: Document,
  ): Remark<Document | undefined> {
    const remark = parent
      ? new Remark(
          `Document ${parent.id} updated as relation of ${document.id}`,
          parent,
        )
      : new Remark<Document | undefined>(
          `No relations to update for document ${document.id}`,
        );
    this.report(`Remark drafted: ${remark.text}.`);
    return remark;
  }

  public remarkOnDocumentList(documents: Document[]): Remark<Document[]> {
    const lines = documents.map((doc) => `- ${doc.id}: ${doc.title}`);
    const remark = new Remark(
      ['*Sigh* As you wish:', ...lines].join('\n'),
      documents,
    );
    this.report(`Remark drafted: ${remark.text}.`);
    return remark;
  }

  public remarkOnDocumentRename(document: Document): Remark<Document> {
    const remark = new Remark(
      `Document ${document.id} renamed to "${document.title}"`,
      document,
    );
    this.report(`Remark drafted: ${remark.text}.`);
    return remark;
  }

  public remarkOnDocumentMove(document: Document): Remark<Document> {
    const remark = new Remark(`Document ${document.id} moved.`, document);
    this.report(`Remark drafted: ${remark.text}.`);
    return remark;
  }

  public remarkOnDocumentStatusChange(document: Document): Remark<Document> {
    const status = document.getField('status');
    const remark = new Remark(
      `Document ${document.id} status changed to "${status}"`,
      document,
    );
    this.report(`Remark drafted: ${remark.text}.`);
    return remark;
  }

  public remarkOnReadmeUpdate(
    readme: Document,
    document: Document,
  ): Remark<Document> {
    const remark = new Remark(
      `README updated to include ${document.id}.`,
      readme,
    );
    this.report(`Remark drafted: ${remark.text}`);
    return remark;
  }

  public makeDummyRemark(): Remark {
    return new Remark('Dummy remark');
  }
}
