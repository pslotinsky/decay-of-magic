import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { PoeConfig } from '../Config/PoeConfig';
import { RendererRegistry } from '../Renderers/RendererRegistry';

/**
 * Renders the full package report by dispatching each configured
 * layer to its matching renderer
 */
export class PackageReport {
  private readonly config: PoeConfig;
  private readonly classRegistry: ClassRegistry;
  private readonly renderers: RendererRegistry;

  constructor(config: PoeConfig, classRegistry: ClassRegistry) {
    this.config = config;
    this.classRegistry = classRegistry;
    this.renderers = new RendererRegistry();
  }

  public render(): string {
    const sections = this.config.layers
      .map((layer) => ({ layer, body: this.renderLayerBody(layer) }))
      .filter((entry) => entry.body.length > 0)
      .map(({ layer, body }) => `## ${layer.title}\n\n${body}`);

    return sections.join('\n\n');
  }

  private renderLayerBody(layer: PoeConfig['layers'][number]): string {
    const classes = this.classRegistry.getLayer(layer.title);

    if (classes.length === 0) {
      return '';
    }

    const renderer = this.renderers.resolve(layer.renderer);

    return renderer.render(layer, classes, this.classRegistry);
  }
}
