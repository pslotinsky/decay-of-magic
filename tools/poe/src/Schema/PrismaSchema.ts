export type PrismaField = {
  name: string;
  type: string;
  optional: boolean;
  list: boolean;
  isId: boolean;
  isUnique: boolean;
  mapped?: string;
};

export type PrismaRelation = {
  holder: string;
  target: string;
  field: string;
  optional: boolean;
  list: boolean;
  fkFields: string[];
};

export class PrismaModel {
  constructor(
    public readonly name: string,
    public readonly tableName: string | undefined,
    public readonly fields: PrismaField[],
    public readonly relations: PrismaRelation[],
  ) {}
}

export class PrismaSchema {
  constructor(public readonly models: PrismaModel[]) {}

  public get isEmpty(): boolean {
    return this.models.length === 0;
  }
}
