import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { InspectedClass } from '../ClassRegistry/InspectedClass';
import { LayerConfig } from '../Config/PoeConfig';
import { Endpoint } from '../Endpoints/Endpoint';
import { Renderer } from './Renderer';

/**
 * Renders a layer as per-controller endpoint tables
 */
export class ApiRenderer implements Renderer {
  public render(
    layer: LayerConfig,
    _classes: InspectedClass[],
    registry: ClassRegistry,
  ): string {
    const endpoints = registry.getLayerEndpoints(layer.title);

    if (endpoints.length === 0) {
      return '';
    }

    const groups = this.groupByController(endpoints);

    return Object.entries(groups)
      .map(([className, controllerEndpoints]) =>
        this.renderController(className, controllerEndpoints),
      )
      .join('\n\n');
  }

  private groupByController(endpoints: Endpoint[]): Record<string, Endpoint[]> {
    const groups: Record<string, Endpoint[]> = {};

    for (const endpoint of endpoints) {
      (groups[endpoint.className] ??= []).push(endpoint);
    }

    return groups;
  }

  private renderController(className: string, endpoints: Endpoint[]): string {
    const title = this.controllerTitle(className);
    const file = endpoints[0].file;
    const rows = [
      '| Endpoint | Description |',
      '|----------|-------------|',
      ...endpoints.map((endpoint) => this.row(endpoint)),
    ];

    return `#### [${title}](${file})\n\n${rows.join('\n')}`;
  }

  private row(endpoint: Endpoint): string {
    const name = `${endpoint.method} ${endpoint.path}`;
    const description = this.descriptionCell(endpoint);

    return `| ${name} | ${description} |`;
  }

  private descriptionCell(endpoint: Endpoint): string {
    const lines: string[] = [];

    if (endpoint.params) {
      lines.push(`Params: \`${this.escape(`(${endpoint.params})`)}\``);
    }

    if (endpoint.returns) {
      lines.push(`Returns: \`${this.escape(endpoint.returns)}\``);
    }

    const signature = lines.join('<br>');
    const paragraphs: string[] = [];

    if (signature) paragraphs.push(signature);
    if (endpoint.description) paragraphs.push(endpoint.description);

    return paragraphs.join('<br><br>');
  }

  private escape(text: string): string {
    return text.replace(/\|/g, '\\|');
  }

  private controllerTitle(className: string): string {
    return className.replace(/(Gate|Controller)$/, '');
  }
}
