import { Document, DocumentProtocol } from '../entities';
import { NotFoundError } from '../errors';
import { Archive, DocumentQueryObject } from '../tools';
import { Assistant } from './Assistant';

export abstract class ArchiveKeeper extends Assistant {
  public readonly title = 'Archive Keeper';

  protected readonly archive: Archive;

  constructor() {
    super();

    this.archive = this.createArchive();
  }

  public async issueDocumentNumber(
    protocol: DocumentProtocol,
  ): Promise<string> {
    const serialNumber = await this.getSerialNumber(protocol);
    const id = this.formatDocumentNumber(serialNumber, protocol);

    this.report(`Reference number ${id} reserved.`);

    return id;
  }

  public async find(options: DocumentQueryObject): Promise<Document[]> {
    return this.archive.find(options);
  }

  public async findById(
    protocol: DocumentProtocol,
    id: string | undefined,
  ): Promise<Document | undefined> {
    const [document] = await this.archive.find({ protocol, prefix: id });

    return document;
  }

  public async findByIdOrFail(
    protocol: DocumentProtocol,
    id: string | undefined,
  ): Promise<Document> {
    const document = await this.findById(protocol, id);

    if (!document) {
      throw new NotFoundError('Document', { id, protocol: protocol.id });
    }

    return document;
  }

  public async save(document: Document): Promise<Document> {
    const result = await this.archive.save(document);

    this.report(`Document ${document.id || document.fileName} filed.`);

    return result;
  }

  public async delete(document: Document): Promise<void> {
    await this.archive.delete({
      protocol: document.metadata.protocol,
      prefix: document.id,
    });

    this.report(`Document ${document.id} expunged from the archive.`);
  }

  public async replace(
    query: DocumentQueryObject,
    oldText: string,
    newText: string,
  ): Promise<void> {
    return this.archive.replace(query, oldText, newText);
  }

  protected async getSerialNumber(protocol: DocumentProtocol): Promise<number> {
    const count = await this.archive.count({
      protocol: protocol,
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
