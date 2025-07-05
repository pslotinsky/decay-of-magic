import { DocumentProtocol } from './DocumentProtocol';

type DocumentParams = {
  id: string;
  name: string;
  protocol: DocumentProtocol;
};

export class Document {
  public readonly id: string;
  public readonly name: string;
  public readonly protocol: DocumentProtocol;

  constructor(params: DocumentParams) {
    this.id = params.id;
    this.name = params.name;
    this.protocol = params.protocol;
  }
}
