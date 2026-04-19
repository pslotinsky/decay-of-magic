import { ErrorCode } from './codes';
import { DomainError } from './domain.error';

export class NotFoundError extends DomainError {
  public readonly code = ErrorCode.NotFound;
}
