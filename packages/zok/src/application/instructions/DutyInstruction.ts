import { Remark, Plea } from '@zok/domain/entities';

import { ZokAssistants } from '../ZokAssistants';

export type DutyInstructionParams = {
  assistants: ZokAssistants;
  plea: Plea;
};

export abstract class DutyInstruction<
  TParams extends DutyInstructionParams = DutyInstructionParams,
  TResult = unknown,
> {
  protected params: TParams;

  constructor(params: TParams) {
    this.params = params;
  }

  public get assistants(): ZokAssistants {
    return this.params.assistants;
  }

  public abstract execute(): Promise<Remark<TResult>>;
}
