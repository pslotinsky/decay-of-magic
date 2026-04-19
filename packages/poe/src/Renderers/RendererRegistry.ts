import { RendererKind } from '../Config/PoeConfig';
import { ApiRenderer } from './ApiRenderer';
import { ApplicationRenderer } from './ApplicationRenderer';
import { DomainRenderer } from './DomainRenderer';
import { Renderer } from './Renderer';

/**
 * Resolves a renderer by kind. Kinds without a dedicated renderer
 * fall back to the domain renderer until their step lands.
 */
export class RendererRegistry {
  private readonly domain: Renderer;
  private readonly application: Renderer;
  private readonly api: Renderer;

  constructor() {
    this.domain = new DomainRenderer();
    this.application = new ApplicationRenderer();
    this.api = new ApiRenderer();
  }

  public resolve(kind: RendererKind): Renderer {
    switch (kind) {
      case 'domain':
        return this.domain;
      case 'application':
        return this.application;
      case 'api':
        return this.api;
      case 'infrastructure':
        return this.domain;
    }
  }
}
