import { ValidationError } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

import { ErrorDetail } from '@dod/api-contract';

import { ValidationFailedError } from '../errors/validation-failed.error';

const CONSTRAINT_CODES: Record<string, string> = {
  isDefined: 'REQUIRED',
  isNotEmpty: 'REQUIRED',
  isString: 'INVALID_TYPE',
  isNumber: 'INVALID_TYPE',
  isBoolean: 'INVALID_TYPE',
  isInt: 'INVALID_TYPE',
  isArray: 'INVALID_TYPE',
  isObject: 'INVALID_TYPE',
  isEnum: 'INVALID_ENUM',
  isUuid: 'INVALID_UUID',
  isEmail: 'INVALID_EMAIL',
  isUrl: 'INVALID_URL',
  isDateString: 'INVALID_DATE',
  minLength: 'MIN_LENGTH',
  maxLength: 'MAX_LENGTH',
  min: 'MIN',
  max: 'MAX',
  matches: 'INVALID_FORMAT',
};

function flatten(errors: ValidationError[], parent = ''): ErrorDetail[] {
  const out: ErrorDetail[] = [];

  for (const error of errors) {
    const field = parent ? `${parent}.${error.property}` : error.property;

    if (error.constraints) {
      for (const [constraint, message] of Object.entries(error.constraints)) {
        out.push({
          code: CONSTRAINT_CODES[constraint] ?? 'INVALID',
          field,
          message,
        });
      }
    }

    if (error.children && error.children.length > 0) {
      out.push(...flatten(error.children, field));
    }
  }

  return out;
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    exceptionFactory: (errors: ValidationError[]) =>
      new ValidationFailedError('Request validation failed', flatten(errors)),
  });
}
