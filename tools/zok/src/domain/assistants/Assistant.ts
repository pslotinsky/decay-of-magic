import { Dossier } from '../entities';
import { pleaContext } from '../PleaContext';

export abstract class Assistant {
  public abstract readonly title: string;
  public abstract readonly dossier: Dossier;

  protected report(note: string): void {
    pleaContext.getStore()?.addReport(this, note);
  }

  public async init(): Promise<void> {}
}
