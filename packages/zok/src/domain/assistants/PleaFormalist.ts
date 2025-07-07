import { Plea, PleaDraft } from '../entities';
import { Assistant } from './Assistant';

export abstract class PleaFormalist extends Assistant {
  public async formalizePlea(draft: PleaDraft): Promise<Plea> {
    const id = await this.issueId();

    return Plea.make(id, draft);
  }

  protected abstract issueId(): Promise<string>;
}
