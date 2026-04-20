import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

export class ForbiddenError extends DomainError {
  public readonly code = ErrorCode.Forbidden;
}
