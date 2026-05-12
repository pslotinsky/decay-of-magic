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
      .map((layer) => this.renderLayer(layer))
      .filter((section) => section.length > 0);

    return sections.length > 0 ? `## Classes\n\n${sections.join('\n\n')}` : '';
  }

  private renderLayer(layer: PoeConfig['layers'][number]): string {
    const classes = this.classRegistry.getLayer(layer.title);

    if (classes.length === 0) {
      return '';
    }

    const renderer = this.renderers.resolve(layer.renderer);
    const body = renderer.render(layer, classes, this.classRegistry);

    return body ? `### ${layer.title}\n\n${body}` : '';
  }
}
