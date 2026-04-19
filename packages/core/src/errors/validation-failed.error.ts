import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

export class ValidationFailedError extends DomainError {
  public readonly code = ErrorCode.ValidationFailed;
}
