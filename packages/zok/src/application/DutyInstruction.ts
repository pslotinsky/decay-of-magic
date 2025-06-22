import { Plea } from '../domain/Plea';
import { Remark } from '../domain/Remark';

export abstract class DutyInstruction {
  constructor(public readonly plea: Plea) {}

  public abstract execute(): Promise<Remark>;
}
