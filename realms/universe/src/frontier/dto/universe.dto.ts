import { plainToInstance } from 'class-transformer';

import { Universe } from '@/lore/entities/universe.entity';

export class UniverseDto {
  public static from(universe: Universe): UniverseDto {
    return plainToInstance(UniverseDto, universe);
  }

  public id!: string;
  public name!: string;
  public description!: string | null;
  public cover!: string | null;
}
