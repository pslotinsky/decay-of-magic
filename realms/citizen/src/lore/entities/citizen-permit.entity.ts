export type CitizenPermitParams = {
  id: string; // equals citizenId — permit is uniquely identified by its citizen
  secret: string;
  issuedAt: Date;
};

export class CitizenPermit {
  public static create(params: CitizenPermitParams): CitizenPermit {
    return new CitizenPermit(params);
  }

  public readonly id: string;
  public secret: string;
  public readonly issuedAt: Date;

  protected constructor(params: CitizenPermitParams) {
    this.id = params.id;
    this.secret = params.secret;
    this.issuedAt = params.issuedAt;
  }
}
