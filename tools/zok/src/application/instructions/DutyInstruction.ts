import { Document, DocumentProtocol, Plea, Remark } from '@/domain/entities';

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

  public get plea(): Plea {
    return this.params.plea;
  }

  public get assistants(): ZokAssistants {
    return this.params.assistants;
  }

  public abstract execute(): Promise<Remark<TResult>>;

  protected async getDocument(protocol: DocumentProtocol): Promise<Document> {
    const id = this.params.plea.getValue<string>('id');

    return this.assistants.archiveKeeper.findByIdOrFail(protocol, id);
  }
}
