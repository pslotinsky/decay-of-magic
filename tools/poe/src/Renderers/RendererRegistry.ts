import { RendererKind } from '../Config/PoeConfig';
import { ApiRenderer } from './ApiRenderer';
import { ApplicationRenderer } from './ApplicationRenderer';
import { DomainRenderer } from './DomainRenderer';
import { InfrastructureRenderer } from './InfrastructureRenderer';
import { Renderer } from './Renderer';

/**
 * Resolves a renderer by kind
 */
export class RendererRegistry {
  private readonly domain: Renderer;
  private readonly application: Renderer;
  private readonly api: Renderer;
  private readonly infrastructure: Renderer;

  constructor() {
    this.domain = new DomainRenderer();
    this.application = new ApplicationRenderer();
    this.api = new ApiRenderer();
    this.infrastructure = new InfrastructureRenderer();
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
        return this.infrastructure;
    }
  }
}
