import { v4 as uuid } from 'uuid';

export type FileParams = {
  id?: string;
  category?: string;
  name: string;
  buffer: Buffer;
  mimetype: string;
};

type ConstructorParams = Required<FileParams>;

export class File {
  public static create(params: FileParams): File {
    const { id = uuid(), category = 'other', ...rest } = params;

    return new File({ id, category, ...rest });
  }

  public readonly id: string;
  public readonly category: string;
  public readonly name: string;
  public readonly buffer: Buffer;
  public readonly mimetype: string;

  public constructor(params: ConstructorParams) {
    this.id = params.id;
    this.category = params.category;
    this.name = params.name;
    this.buffer = params.buffer;
    this.mimetype = params.mimetype;
  }
}
