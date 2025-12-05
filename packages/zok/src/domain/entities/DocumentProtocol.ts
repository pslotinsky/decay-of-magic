import { UnexpectedValueError } from '../errors';
import { FieldDefinition, FieldType } from './FieldDefinition';

type DocumentProtocolParams = {
  id: string;
  prefix: string;
  idDigits: number;
  path: string;
  template: string;
  aliases: string[];
  fields: Record<string, FieldDefinition>;
};

export class DocumentProtocol {
  public static Name = DocumentProtocol.constructor.name;

  public static UnknownId = 'UnknownId';

  public static init(params: DocumentProtocolParams): DocumentProtocol {
    return new DocumentProtocol(params);
  }

  public readonly id: string;
  public readonly prefix: string;
  public readonly idDigits: number;
  public readonly path: string;
  public readonly template: string;
  public readonly aliases: string[];
  public readonly fields: Record<string, FieldDefinition>;

  protected constructor(params: DocumentProtocolParams) {
    this.id = params.id;
    this.prefix = params.prefix;
    this.idDigits = params.idDigits;
    this.path = params.path;
    this.template = params.template;
    this.aliases = params.aliases;
    this.fields = params.fields;
  }

  public get parentProtocolId(): string | undefined {
    const parent = this.fields.parent;

    return parent?.type === FieldType.Link ? parent.protocol : undefined;
  }

  public getField(key: string): FieldDefinition {
    const field = this.fields[key];

    if (!field) {
      throw new UnexpectedValueError(
        key,
        `A field definition ${key} is unknown for a protocol ${this.id}`,
      );
    }

    return field;
  }

  public findFieldKeyByName(name: string): string {
    const entry = Object.entries(this.fields).find(
      ([_key, field]) => field.name === name,
    );

    if (!entry) {
      throw new UnexpectedValueError(
        name,
        `A field with name ${name} is unknown for a protocol ${this.id}`,
      );
    }

    return entry[0];
  }

  public normalizeFieldValue(key: string, value: unknown): unknown {
    const field = this.getField(key);

    switch (field.type) {
      case FieldType.Date:
        return this.normalizeDocumentDateField(value);
      case FieldType.Enum:
        return this.normalizeDocumentEnumField(value, field.values);
      case FieldType.Link:
        return value; // TODO: Link on document
      default:
        throw new UnexpectedValueError(field, 'Impossible filed');
    }
  }

  protected normalizeDocumentDateField(value: unknown): unknown {
    return new Date(value as string | number | Date);
  }

  protected normalizeDocumentEnumField(
    value: unknown,
    values: string[],
  ): string {
    if (!values.includes(value as string)) {
      throw new UnexpectedValueError(
        value,
        `Enum value must be in ${JSON.stringify(values)}`,
      );
    }

    return value as string;
  }
}
