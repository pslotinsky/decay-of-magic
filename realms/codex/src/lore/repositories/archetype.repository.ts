import { EntityRepository } from '@dod/core';

import { Archetype } from '../entities/archetype.entity';

/**
 * Repository for codex archetypes. Scoped per Universe; entries are keyed by
 * (universeId, id).
 */
export abstract class ArchetypeRepository extends EntityRepository<Archetype> {}
