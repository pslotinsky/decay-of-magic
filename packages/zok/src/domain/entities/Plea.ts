import { DocumentProtocol } from './DocumentProtocol';

export enum PleaType {
  Create = 'Create',
  Rename = 'Rename',
  ChangeStatus = 'ChangeStatus',
  List = 'List',
  Unknown = 'Unknown',
}

export type PleaDraft = Partial<PleaForm>;

type PleaForm = {
  type: PleaType;
  protocol: string;
  values: Record<string, unknown>;
  creationTime: Date;
};

export class Plea {
  public static make(id: string, draft: PleaDraft): Plea {
    return new Plea(id, {
      type: draft.type ?? PleaType.Unknown,
      protocol: draft.protocol ?? DocumentProtocol.UnknownId,
      values: draft.values ?? {},
      creationTime: draft.creationTime ?? new Date(),
    });
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

  public get creationTime(): Date {
    return this.form.creationTime;
  }

  public getValue<T = unknown>(key: string, defaultValue: T): T;
  public getValue<T = unknown>(key: string): T | undefined;
  public getValue<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const value = this.form.values[key] as T | undefined;

    return value ?? defaultValue;
  }

  public setValue<T = unknown>(key: string, value: T): void {
    this.form.values[key] = value;
  }
}
