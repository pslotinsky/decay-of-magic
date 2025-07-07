import { Document, Remark } from '../entities';
import { Assistant } from './Assistant';

export class HumorAdvisor extends Assistant {
  public remarkOnDocumentCreation(document: Document): Remark {
    return Remark.create(`Document ${document.id} created`, document);
  }
}
