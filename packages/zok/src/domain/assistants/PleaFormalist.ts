import { DocumentProtocol } from '../document';
import { Plea, PleaType, PleaForm } from '../plea';
import { Assistant } from './Assistant';

export type PleaDraft = Partial<PleaForm>;

export abstract class PleaFormalist extends Assistant {
  public async formalizePlea(draft: PleaDraft): Promise<Plea> {
    const id = await this.issueId();
    const form = this.fillPleaForm(draft);

    return Plea.make(id, form);
  }

  protected abstract issueId(): Promise<string>;

  protected fillPleaForm(draft: PleaDraft): PleaForm {
    return {
      type: this.fillPleaType(draft),
      protocol: this.fillPleaProtocol(draft),
      values: this.fillPleaValues(draft),
      creationTime: this.fillPleaCreationTime(draft),
    };
  }

  protected fillPleaType(draft: PleaDraft): PleaType {
    return draft.type ?? PleaType.Unknown;
  }

  protected fillPleaProtocol(draft: PleaDraft): string {
    return draft.protocol ?? DocumentProtocol.UnknownId;
  }

  protected fillPleaValues(draft: PleaDraft): Record<string, unknown> {
    const values = draft.values ?? {};
    const creationTime = values.creationTime ?? new Date();

    return { ...values, creationTime };
  }

  protected fillPleaCreationTime(draft: PleaDraft): Date {
    return draft.creationTime ?? new Date();
  }
}
