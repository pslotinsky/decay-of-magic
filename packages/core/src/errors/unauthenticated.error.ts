import { ErrorCode } from './codes';
import { DomainError } from './domain.error';

export class UnauthenticatedError extends DomainError {
  public readonly code = ErrorCode.Unauthenticated;
}
