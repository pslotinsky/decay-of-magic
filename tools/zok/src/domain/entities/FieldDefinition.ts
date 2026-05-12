export enum FieldType {
  Enum = 'enum',
  Link = 'link',
  Date = 'date',
  Text = 'text',
}

type BaseFieldDefinition = {
  name: string;
};

type EnumFieldDefinition = BaseFieldDefinition & {
  type: FieldType.Enum;
  values: Record<string, string>;
};

type LinkFieldDefinition = BaseFieldDefinition & {
  type: FieldType.Link;
  protocol: string;
};

type DateFieldDefinition = BaseFieldDefinition & {
  type: FieldType.Date;
};

type TextFieldDefinition = BaseFieldDefinition & {
  type: FieldType.Text;
};

export type FieldDefinition =
  | EnumFieldDefinition
  | LinkFieldDefinition
  | DateFieldDefinition
  | TextFieldDefinition;
