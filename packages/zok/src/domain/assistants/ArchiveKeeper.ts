import { Archive } from '../tools';
import { Document, DocumentProtocol } from '../entities';
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
    const serialNumber = await this.getSerialNumber(protocol);

    return this.formatDocumentNumber(serialNumber, protocol);
  }

  public async save(document: Document): Promise<Document> {
    return this.archive.save(document);
  }

  protected async getSerialNumber(protocol: DocumentProtocol): Promise<number> {
    const count = await this.archive.count({
      protocol: protocol.id,
      prefix: protocol.prefix,
    });

    return count + 1;
  }

  protected formatDocumentNumber(
    serialNumber: number,
    protocol: DocumentProtocol,
  ): string {
    const formattedSerialNumber = serialNumber
      .toString()
      .padStart(protocol.idDigits, '0');

    return `${protocol.prefix}-${formattedSerialNumber}`;
  }

  protected abstract createArchive(): Archive;
}
