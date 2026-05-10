import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

/**
 * Signals a malformed or unacceptable request that doesn't fit the more
 * specific domain errors.
 */
export class BadRequestError extends DomainError {
  public readonly code = ErrorCode.BadRequest;
}
