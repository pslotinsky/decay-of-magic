import { RendererKind } from '../Config/PoeConfig';
import { DomainRenderer } from './DomainRenderer';
import { Renderer } from './Renderer';

/**
 * Resolves a renderer by kind. Kinds without a dedicated renderer
 * fall back to the domain renderer until their step lands.
 */
export class RendererRegistry {
  private readonly domain: Renderer;

  constructor() {
    this.domain = new DomainRenderer();
  }

  public resolve(kind: RendererKind): Renderer {
    switch (kind) {
      case 'domain':
        return this.domain;
      case 'api':
      case 'application':
      case 'infrastructure':
        return this.domain;
    }
  }
}
