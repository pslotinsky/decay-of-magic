import { FieldDefinition } from './FieldDefinition';

export type DocumentProtocolParams = {
  id: string;
  prefix: string;
  idDigits: number;
  path: string;
  template: string;
  aliases: string[];
  fields: Record<string, FieldDefinition>;
};

export class DocumentProtocol {
  public static UnknownId = 'UnknownId';

  public readonly id: string;
  public readonly prefix: string;
  public readonly idDigits: number;
  public readonly path: string;
  public readonly template: string;
  public readonly aliases: string[];
  public readonly fields: Record<string, FieldDefinition>;

  public constructor(params: DocumentProtocolParams) {
    this.id = params.id;
    this.prefix = params.prefix;
    this.idDigits = params.idDigits;
    this.path = params.path;
    this.template = params.template;
    this.aliases = params.aliases;
    this.fields = params.fields;
  }
}
