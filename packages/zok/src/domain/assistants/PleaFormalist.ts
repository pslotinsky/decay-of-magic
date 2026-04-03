import { Plea, PleaDraft } from '../entities';
import { pleaContext } from '../PleaContext';
import { Assistant } from './Assistant';

export abstract class PleaFormalist extends Assistant {
  public readonly title = 'Plea Formalist';

  public async formalizePlea(draft: PleaDraft): Promise<Plea> {
    const id = await this.issueId();
    const plea = Plea.make(id, draft);

    pleaContext.run(plea, () => {
      this.report(
        `Petition formalised. Type: ${plea.type.toLowerCase()}, Protocol: ${plea.protocol}, Reference: ${plea.id}.`,
      );
    });

    return plea;
  }

  protected abstract issueId(): Promise<string>;
}
