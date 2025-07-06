import { Remark } from '../remark';
import { Document } from '../document';
import { Assistant } from './Assistant';

export class HumorAdvisor extends Assistant {
  public remarkOnDocumentCreation(document: Document): Remark {
    return Remark.create(`Document ${document.id} created`, document);
  }
}
