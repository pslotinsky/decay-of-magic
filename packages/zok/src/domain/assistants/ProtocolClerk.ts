import { DocumentProtocol } from '../entities';
import { NotFoundError } from '../errors';
import { Assistant } from './Assistant';

export abstract class ProtocolClerk extends Assistant {
  protected protocols: Map<string, DocumentProtocol> = new Map();

  public getProtocol(id: string): DocumentProtocol {
    let protocol = this.protocols.get(id);

    if (!protocol) {
      protocol = this.findByAlias(id);
    }

    if (!protocol) {
      throw new NotFoundError(DocumentProtocol.Name, { id });
    }

    return protocol;
  }

  public hasProtocol(id: string): boolean {
    return this.protocols.has(id);
  }

  public getChildProtocols(parentProtocolId: string): DocumentProtocol[] {
    const protocols = Array.from(this.protocols.values());

    return protocols.filter(
      (protocol) => protocol.parentProtocolId === parentProtocolId,
    );
  }

  protected findByAlias(alias: string): DocumentProtocol | undefined {
    const protocols = Array.from(this.protocols.values());

    return protocols.find((protocol) => protocol.aliases.includes(alias));
  }
}
