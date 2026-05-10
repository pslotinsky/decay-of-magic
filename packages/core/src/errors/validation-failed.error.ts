import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

/**
 * Signals that input failed schema validation. Carries per-field details so
 * callers can surface structured feedback.
 */
export class ValidationFailedError extends DomainError {
  public readonly code = ErrorCode.ValidationFailed;
}
