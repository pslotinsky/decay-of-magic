import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

export class BadRequestError extends DomainError {
  public readonly code = ErrorCode.BadRequest;
}
