import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

/**
 * Signals that the request is well-formed but rejected on semantic grounds —
 * a domain rule prevents the operation from completing.
 */
export class UnprocessableError extends DomainError {
  public readonly code = ErrorCode.Unprocessable;
}
