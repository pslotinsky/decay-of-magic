import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

/**
 * Signals that the operation conflicts with current state, such as a duplicate
 * identifier or a concurrent modification.
 */
export class ConflictError extends DomainError {
  public readonly code = ErrorCode.Conflict;
}
