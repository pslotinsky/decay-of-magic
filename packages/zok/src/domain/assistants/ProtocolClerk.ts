import { DocumentProtocol } from '../document';
import { NotFoundError } from '../errors';
import { Plea } from '../Plea';
import { Assistant } from './Assistant';

export abstract class ProtocolClerk extends Assistant {
  protected protocols: Map<string, DocumentProtocol> = new Map();

  public getProtocol(plea: Plea): DocumentProtocol {
    const protocol = this.protocols.get(plea.type);

    if (!protocol) {
      throw new NotFoundError(DocumentProtocol, { id: plea.type });
    }

    return protocol;
  }
}
