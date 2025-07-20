import { FieldDefinition } from '@zok/domain/entities';

export type Protocols = Record<string, ProtocolConfig>;

type ProtocolConfig = {
  prefix: string;
  idDigits: number;
  path: string;
  template: string;
  aliases: string[];
  fields: Record<string, FieldDefinition>;
};
