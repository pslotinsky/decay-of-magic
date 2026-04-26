import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

/**
 * Signals that the caller is authenticated but not authorized for the
 * requested operation.
 */
export class ForbiddenError extends DomainError {
  public readonly code = ErrorCode.Forbidden;
}
