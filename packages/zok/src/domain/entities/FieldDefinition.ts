export enum FieldType {
  Enum = 'enum',
  Link = 'Roadmap',
  Date = 'date',
}

type BaseFieldDefinition = {
  name: string;
  type: FieldType;
};

type EnumFieldDefinition = BaseFieldDefinition & {
  type: FieldType.Enum;
  values: string[];
};

type LinkFieldDefinition = BaseFieldDefinition & {
  type: FieldType.Link;
  protocol: string;
};

type DateFieldDefinition = BaseFieldDefinition & {
  type: FieldType.Date;
};

export type FieldDefinition =
  | EnumFieldDefinition
  | LinkFieldDefinition
  | DateFieldDefinition;
