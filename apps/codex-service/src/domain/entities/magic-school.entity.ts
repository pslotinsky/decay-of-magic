export type MagicSchoolParams = {
  id: string;
  name: string;
  description: string;
};

export class MagicSchool {
  public static create(params: MagicSchoolParams): MagicSchool {
    return new MagicSchool(params);
  }

  public readonly id: string;
  public name: string;
  public description: string;

  protected constructor(params: MagicSchoolParams) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
  }
}
