import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { InspectedClass } from '../ClassRegistry/InspectedClass';
import { LayerConfig } from '../Config/PoeConfig';
import { ClassDiagram } from '../ReadmeWriter/ClassDiagram';
import { ClassTable } from '../ReadmeWriter/ClassTable';
import { Renderer } from './Renderer';

/**
 * Renders a layer as a Mermaid class diagram plus a table of its classes
 */
export class DomainRenderer implements Renderer {
  public render(
    layer: LayerConfig,
    classes: InspectedClass[],
    registry: ClassRegistry,
  ): string {
    if (classes.length === 0) {
      return '';
    }

    const diagram = new ClassDiagram(registry).renderLayer(
      layer.title,
      classes,
    );
    const table = new ClassTable(layer.root, classes, registry).renderContent();

    return `${diagram}\n\n${table}`;
  }
}
