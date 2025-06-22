import { Plea } from '../Plea';
import { PleaType } from '../PleaType';
import { Assistant } from './Assistant';

export class PleaFormalist extends Assistant {
  public formalizePlea(text: string): Plea {
    return new Plea(PleaType.Create);
  }
}
