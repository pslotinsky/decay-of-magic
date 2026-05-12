type DossierParams = {
  name: string;
  age: number;
  race: string;
  gender: string;
  bio: string;
};

export class Dossier {
  public readonly name: string;
  public readonly age: number;
  public readonly race: string;
  public readonly gender: string;
  public readonly bio: string;

  constructor(params: DossierParams) {
    this.name = params.name;
    this.age = params.age;
    this.race = params.race;
    this.gender = params.gender;
    this.bio = params.bio;
  }
}
