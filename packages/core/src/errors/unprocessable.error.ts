import { ErrorCode } from './codes';
import { DomainError } from './domain.error';

export class UnprocessableError extends DomainError {
  public readonly code = ErrorCode.Unprocessable;
}
