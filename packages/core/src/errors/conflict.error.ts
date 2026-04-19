import { ErrorCode } from './codes';
import { DomainError } from './domain.error';

export class ConflictError extends DomainError {
  public readonly code = ErrorCode.Conflict;
}
