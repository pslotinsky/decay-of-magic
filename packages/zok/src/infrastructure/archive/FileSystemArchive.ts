import { createReadStream } from 'node:fs';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { resolve } from 'node:path';

import { Archive, DocumentQueryObject } from '@zok/domain/tools';
import { Document, DocumentProtocol } from '@zok/domain/entities';

const { DOC_PATH } = process.env;
const DEFAULT_DOC_PATH = resolve(__dirname, '../../../../../docs');

export class FileSystemArchive extends Archive {
  private path: string;

  constructor(path: string = DOC_PATH ?? DEFAULT_DOC_PATH) {
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
    const { protocol } = document.metadata;

    if (document.id) {
      const oldFileName = await this.findFileName(protocol, document.id);

      if (oldFileName && oldFileName !== document.fileName) {
        await this.deleteFile(protocol, oldFileName);
      }
    }

    await this.writeFile(protocol, document.fileName, document.content);

    return document;
  }

  public async replace(
    query: DocumentQueryObject,
    oldText: string,
    newText: string,
  ): Promise<void> {
    const files = await this.findFiles({ ...query, containing: oldText });

    await Promise.all(
      files.map(async (name) => {
        const content = await this.readFile(query.protocol, name);
        const filePath = this.resolveFilePath(query.protocol, name);

        await writeFile(
          filePath,
          content.replaceAll(oldText, newText),
          'utf-8',
        );
      }),
    );
  }

  private async findFileName(
    protocol: DocumentProtocol,
    id: string,
  ): Promise<string | undefined> {
    const files = await this.findFiles({ protocol, prefix: id });

    return files[0];
  }

  private async deleteFile(
    protocol: DocumentProtocol,
    name: string,
  ): Promise<void> {
    const path = this.resolveFilePath(protocol, name);

    await unlink(path);
  }

  private async findFiles(
    query: DocumentQueryObject & { containing?: string },
  ): Promise<string[]> {
    let files: string[];

    try {
      const { protocol, prefix, containing } = query;
      files = await this.readDir(protocol);

      if (prefix) {
        files = files.filter((file) => file.startsWith(prefix));
      }

      if (containing) {
        files = await this.filterByContent(protocol, files, containing);
      }
    } catch {
      files = [];
    }

    return files;
  }

  private async filterByContent(
    protocol: DocumentProtocol,
    files: string[],
    text: string,
  ): Promise<string[]> {
    const results = await Promise.all(
      files.map(async (name) => {
        const filePath = this.resolveFilePath(protocol, name);
        const found = await this.fileContains(filePath, text);

        return found ? name : null;
      }),
    );

    return results.filter((name): name is string => name !== null);
  }

  private fileContains(filePath: string, text: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const rl = createInterface({ input: createReadStream(filePath) });
      let found = false;

      rl.on('line', (line: string) => {
        if (!found && line.includes(text)) {
          found = true;
          rl.close();
        }
      });

      rl.on('close', () => resolve(found));
      rl.on('error', reject);
    });
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
