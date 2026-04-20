import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

export class ConflictError extends DomainError {
  public readonly code = ErrorCode.Conflict;
}
