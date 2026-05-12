import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { Endpoint } from '../Endpoints/Endpoint';
import { EndpointExtractor } from '../Endpoints/EndpointExtractor';
import { ScannedFile } from '../Scanner/ScannedFile';
import { PrismaSchema } from '../Schema/PrismaSchema';
import { ClassParser } from './ClassParser';
import { RelationBuilder } from './RelationBuilder';

/**
 * Parses a collection of scanned files into a ClassRegistry
 */
export class ClassRegistryParser {
  private readonly endpointExtractor = new EndpointExtractor();

  public parse(files: ScannedFile[], schema?: PrismaSchema): ClassRegistry {
    const parsers = files.map((file) => new ClassParser(file));
    const result = parsers.flatMap((parser) => parser.classes());
    const externalSources = this.mergeImports(parsers);
    const endpoints = this.extractEndpoints(files);
    const registry = new ClassRegistry(
      result,
      externalSources,
      endpoints,
      schema,
    );

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

  private extractEndpoints(files: ScannedFile[]): Endpoint[] {
    return files.flatMap((file) => this.endpointExtractor.extract(file));
  }
}
