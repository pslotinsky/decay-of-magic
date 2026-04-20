import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { InspectedClass } from '../ClassRegistry/InspectedClass';
import { LayerConfig } from '../Config/PoeConfig';

export interface Renderer {
  render(
    layer: LayerConfig,
    classes: InspectedClass[],
    registry: ClassRegistry,
  ): string;
}
