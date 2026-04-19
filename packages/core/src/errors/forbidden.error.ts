import { ErrorCode } from './codes';
import { DomainError } from './domain.error';

export class ForbiddenError extends DomainError {
  public readonly code = ErrorCode.Forbidden;
}
