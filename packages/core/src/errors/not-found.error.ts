import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

/**
 * Signals that the requested resource does not exist.
 */
export class NotFoundError extends DomainError {
  public readonly code = ErrorCode.NotFound;
}
