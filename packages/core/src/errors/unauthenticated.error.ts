import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

/**
 * Signals that the caller is not authenticated.
 */
export class UnauthenticatedError extends DomainError {
  public readonly code = ErrorCode.Unauthenticated;
}
