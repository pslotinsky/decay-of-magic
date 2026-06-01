import { EntityRepository } from '@dod/core';

import type { Protocol } from '../entities/protocol.entity';

/** Persists Protocols. */
export abstract class ProtocolRepository extends EntityRepository<Protocol> {}
