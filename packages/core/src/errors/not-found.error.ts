import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

export class NotFoundError extends DomainError {
  public readonly code = ErrorCode.NotFound;
}
