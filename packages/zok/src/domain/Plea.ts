import { PleaType } from './PleaType';

export class Plea {
  constructor(
    public readonly type: PleaType,
    public readonly values?: Record<string, unknown>,
  ) {}
}
