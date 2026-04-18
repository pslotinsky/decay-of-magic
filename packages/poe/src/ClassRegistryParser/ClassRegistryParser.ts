import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { ScannedFile } from '../Scanner/ScannedFile';
import { ClassParser } from './ClassParser';
import { RelationBuilder } from './RelationBuilder';

/**
 * Parses a collection of scanned files into a ClassRegistry
 */
export class ClassRegistryParser {
  public parse(files: ScannedFile[]): ClassRegistry {
    const parsers = files.map((file) => new ClassParser(file));
    const result = parsers.flatMap((parser) => parser.classes());
    const externalSources = this.mergeImports(parsers);
    const registry = new ClassRegistry(result, externalSources);

    return new RelationBuilder(registry).buildRelations();
  }

  private mergeImports(parsers: ClassParser[]): Map<string, string> {
    const externalSources = new Map<string, string>();

    for (const parser of parsers) {
      for (const [name, source] of parser.imports()) {
        externalSources.set(name, source);
      }
    }

    return externalSources;
  }
}
