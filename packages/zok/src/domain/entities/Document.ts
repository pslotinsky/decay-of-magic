import { kebabCase } from 'lodash';
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
  toc?: DocumentToc;
};

export type DocumentToc = {
  protocolName: string;
  lines: DocumentTocLine[];
};

export type DocumentTocLine = {
  id: string;
  title: string;
  link: string;
  status?: DocumentStatus;
};

export enum DocumentStatus {
  InProgress = 'In progress',
  Done = 'Done',
  Cancelled = 'Cancelled',
  Planned = 'Planned',
}

export class Document {
  public static issue(params: DocumentParams): Document {
    return new Document(params);
  }

  public readonly metadata: DocumentMetadata;
  public content: string;

  protected constructor(params: Required<DocumentParams>) {
    this.metadata = params.metadata;
    this.content = params.content;
  }

  public get id(): string {
    return this.metadata.id;
  }

  public get title(): string {
    return this.metadata.title;
  }

  public get protocol(): DocumentProtocol {
    return this.metadata.protocol;
  }

  public get fileName(): string {
    return `${this.id}_${kebabCase(this.title)}.md`;
  }

  public getField<T = unknown>(name: string): T | undefined {
    return this.metadata.fields[name] as T | undefined;
  }

  public followsProtocol(protocolId: string): boolean {
    const { protocol } = this.metadata;

    return protocol.id === protocolId;
  }
}
