import { Remark } from '../remark';
import { Assistant } from './Assistant';

export class HumorAdvisor extends Assistant {
  public remarkOnDocumentCreation(document: Document): Remark {
    throw new Error('Method not implemented.');
  }
}
