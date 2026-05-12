import type { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import type { InspectedClass } from '../ClassRegistry/InspectedClass';
import type { LayerConfig } from '../Config/PoeConfig';

export interface Renderer {
  render(
    layer: LayerConfig,
    classes: InspectedClass[],
    registry: ClassRegistry,
  ): string;
}
