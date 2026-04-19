import { ErrorCode } from './codes';
import { DomainError } from './domain.error';

export class ValidationFailedError extends DomainError {
  public readonly code = ErrorCode.ValidationFailed;
}
