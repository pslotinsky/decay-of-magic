import { ErrorCode } from './codes';
import { DomainError } from './domain.error';

export class BadRequestError extends DomainError {
  public readonly code = ErrorCode.BadRequest;
}
