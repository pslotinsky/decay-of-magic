import { FieldDefinition } from '@zok/domain/document/FieldDefinition';

export type ZogConfig = {
  archive: ArchiveConfig;
  protocols: Record<string, ProtocolConfig>;
  logging: LoggingConfig;
};

type ArchiveConfig = {
  path: string;
};

type ProtocolConfig = {
  prefix: string;
  idDigits: number;
  path: string;
  template: string;
  aliases: string[];
  fields: Record<string, FieldDefinition>;
};

type LoggingConfig = {
  level: 'fatal' | 'error' | 'info' | 'warn' | 'debug' | 'trace';
};
