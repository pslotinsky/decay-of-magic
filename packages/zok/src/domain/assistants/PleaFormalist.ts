import { Plea, PleaType } from '../Plea';
import { Assistant } from './Assistant';

export class PleaFormalist extends Assistant {
  public formalizePlea(text: string): Plea {
    return new Plea(PleaType.Create);
  }
}
