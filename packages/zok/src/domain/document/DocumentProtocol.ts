import { PleaType } from '../PleaType';
import { FieldDefinition } from './FieldDefinition';

type DocumentProtocolParams = {
  id: PleaType;
  prefix: string;
  idDigits: number;
  path: string;
  template: string;
  aliases: string[];
  fields: Record<string, FieldDefinition>;
};

export class DocumentProtocol {
  public static UnknownName = 'UnknownName';

  public constructor(public readonly params: DocumentProtocolParams) {}
}
