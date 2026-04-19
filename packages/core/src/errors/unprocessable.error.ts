import { ErrorCode } from '@dod/api-contract';

import { DomainError } from './domain.error';

export class UnprocessableError extends DomainError {
  public readonly code = ErrorCode.Unprocessable;
}
