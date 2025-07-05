import { DocumentProtocol } from '../document';
import { NotFoundError } from '../errors';
import { Plea } from '../plea';
import { Assistant } from './Assistant';

export abstract class ProtocolClerk extends Assistant {
  protected protocols: Map<string, DocumentProtocol> = new Map();

  public getProtocol(plea: Plea): DocumentProtocol {
    const protocol = this.protocols.get(plea.protocol);

    if (!protocol) {
      throw new NotFoundError(DocumentProtocol, { name: plea.protocol });
    }

    return protocol;
  }
}
