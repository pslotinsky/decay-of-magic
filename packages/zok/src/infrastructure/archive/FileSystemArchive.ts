import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { kebabCase } from 'lodash';

import { Archive, DocumentQueryObject } from '@zok/domain/tools';
import { Document, DocumentProtocol } from '@zok/domain/entities';

const { DOC_PATH = '../../docs' } = process.env;

export class FileSystemArchive extends Archive {
  private path: string;

  constructor(path: string = DOC_PATH) {
    super();

    this.path = path;
  }

  public async count(query: DocumentQueryObject): Promise<number> {
    const files = await this.findFiles(query);

    return files.length;
  }

  public async find(query: DocumentQueryObject): Promise<Document[]> {
    const files = await this.findFiles(query);

    return Promise.all(
      files.map(async (name) => {
        const content = await this.readFile(query.protocol, name);

        return this.documentParser.parse(query.protocol, content);
      }),
    );
  }

  public async save(document: Document): Promise<Document> {
    const { protocol, title } = document.metadata;

    const name = `${document.id}_${kebabCase(title)}.md`;
    await this.writeFile(protocol, name, document.content);

    return document;
  }

  private async findFiles(query: DocumentQueryObject): Promise<string[]> {
    let files: string[];

    try {
      const { protocol, prefix } = query;
      files = await this.readDir(protocol);

      if (prefix) {
        files = files.filter((file) => file.startsWith(prefix));
      }
    } catch {
      files = [];
    }

    return files;
  }

  private async readFile(
    protocol: DocumentProtocol,
    name: string,
  ): Promise<string> {
    const path = this.resolveFilePath(protocol, name);

    return readFile(path, 'utf-8');
  }

  private async writeFile(
    protocol: DocumentProtocol,
    name: string,
    content: string,
  ): Promise<void> {
    const dir = this.resolveDirPath(protocol);
    const file = this.resolveFilePath(protocol, name);

    await mkdir(dir, { recursive: true });
    await writeFile(file, content, 'utf-8');
  }

  private async readDir(protocol: DocumentProtocol): Promise<string[]> {
    const dir = this.resolveDirPath(protocol);

    return readdir(dir);
  }

  private resolveFilePath(protocol: DocumentProtocol, name: string): string {
    const dir = this.resolveDirPath(protocol);

    return resolve(dir, name);
  }

  private resolveDirPath(protocol: DocumentProtocol): string {
    return resolve(this.path, protocol.path);
  }
}
