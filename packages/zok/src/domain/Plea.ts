export enum PleaType {
  Create = 'Create',
  Rename = 'Rename',
  ChangeStatus = 'ChangeStatus',
  List = 'List',
}

export class Plea {
  constructor(
    public readonly type: PleaType,
    public readonly values?: Record<string, unknown>,
  ) {}
}
