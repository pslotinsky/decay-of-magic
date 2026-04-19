import { readFile } from 'fs/promises';
import { resolve } from 'path';

import { PrismaSchema } from './PrismaSchema';
import { SchemaParser } from './SchemaParser';

const DEFAULT_SCHEMA_PATH = 'prisma/schema.prisma';

/**
 * Reads and parses the Prisma schema for a package, if present
 */
export class SchemaReader {
  private readonly parser = new SchemaParser();

  public async read(packagePath: string): Promise<PrismaSchema | undefined> {
    const schemaPath = resolve(packagePath, DEFAULT_SCHEMA_PATH);

    try {
      const content = await readFile(schemaPath, 'utf-8');
      return this.parser.parse(content);
    } catch {
      return undefined;
    }
  }
}
