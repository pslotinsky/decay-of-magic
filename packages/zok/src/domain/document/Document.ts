import { DocumentProtocol } from './DocumentProtocol';

type DocumentParams = {
  metadata: DocumentMetadata;
  content: string;
};

export type DocumentMetadata = {
  id: string;
  title: string;
  protocol: DocumentProtocol;
  fields: Record<string, unknown>;
};

export class Document {
  public static issue(params: DocumentParams): Document {
    return new Document(params);
  }

  public readonly metadata: DocumentMetadata;
  public readonly content: string;

  protected constructor(params: Required<DocumentParams>) {
    this.metadata = params.metadata;
    this.content = params.content;
  }

  public get id(): string {
    return this.metadata.id;
  }

  public getValue<T = unknown>(key: string): T | undefined {
    return this.metadata.fields[key] as T | undefined;
  }
}
