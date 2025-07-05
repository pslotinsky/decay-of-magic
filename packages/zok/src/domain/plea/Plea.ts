import { PleaType } from './PleaType';

export type PleaForm = {
  type: PleaType;
  protocol: string;
  values: Record<string, unknown>;
  creationTime: Date;
};

export class Plea {
  public static make(id: string, form: PleaForm): Plea {
    return new Plea(id, form);
  }

  public readonly id: string;

  protected readonly form: PleaForm;

  protected constructor(id: string, form: PleaForm) {
    this.id = id;
    this.form = form;
  }

  public get type(): PleaType {
    return this.form.type;
  }

  public get protocol(): string {
    return this.form.protocol;
  }

  public getValue<T = unknown>(key: string, defaultValue: T): T;
  public getValue<T = unknown>(key: string): T | undefined;
  public getValue<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const value = this.form.values[key] as T | undefined;

    return value ?? defaultValue;
  }
}
