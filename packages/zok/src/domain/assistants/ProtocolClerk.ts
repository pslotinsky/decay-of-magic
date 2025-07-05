import { DocumentProtocol } from '../document';
import { NotFoundError } from '../errors';
import { Assistant } from './Assistant';

export abstract class ProtocolClerk extends Assistant {
  protected protocols: Map<string, DocumentProtocol> = new Map();

  public getProtocol(name: string): DocumentProtocol {
    const protocol = this.protocols.get(name);

    if (!protocol) {
      throw new NotFoundError(DocumentProtocol, { name });
    }

    return protocol;
  }
}
