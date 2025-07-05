import { Archive } from '../archive';
import { DocumentProtocol } from '../document';
import { Assistant } from './Assistant';

export abstract class ArchiveKeeper extends Assistant {
  protected readonly archive: Archive;

  constructor() {
    super();

    this.archive = this.createArchive();
  }

  public async issueDocumentNumber(
    protocol: DocumentProtocol,
  ): Promise<string> {
    const count = await this.archive.count({
      protocol: protocol.id,
      prefix: protocol.prefix,
    });

    return this.formatNumber(count + 1, protocol);
  }

  protected abstract createArchive(): Archive;

  protected formatNumber(
    serialNumber: number,
    protocol: DocumentProtocol,
  ): string {
    const formattedSerialNumber = serialNumber
      .toString()
      .padStart(protocol.idDigits, '0');

    return `${protocol.prefix}-${formattedSerialNumber}`;
  }
}
