import { z } from 'zod';
import { Body, Param, PipeTransform, Query } from '@nestjs/common';

import type { ErrorDetail } from '@dod/api-contract';

import { ValidationFailedError } from '../errors/validation-failed.error';

const ISSUE_CODES: Record<string, string> = {
  invalid_type: 'INVALID_TYPE',
  too_small: 'MIN',
  too_big: 'MAX',
  invalid_format: 'INVALID_FORMAT',
  invalid_value: 'INVALID_VALUE',
  invalid_union: 'INVALID',
  invalid_key: 'INVALID_KEY',
  invalid_element: 'INVALID_ELEMENT',
  unrecognized_keys: 'UNRECOGNIZED',
  not_multiple_of: 'INVALID',
  custom: 'INVALID',
};

function flatten(error: z.ZodError): ErrorDetail[] {
  return error.issues.map((issue) => ({
    code: ISSUE_CODES[issue.code] ?? 'INVALID',
    field: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}

export class ZodPipe<TSchema extends z.ZodTypeAny> implements PipeTransform<
  unknown,
  z.output<TSchema>
> {
  constructor(private readonly schema: TSchema) {}

  public transform(value: unknown): z.output<TSchema> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new ValidationFailedError(
        'Request validation failed',
        flatten(result.error),
      );
    }
    return result.data;
  }
}

export function ZodBody<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
): ParameterDecorator {
  return Body(new ZodPipe(schema));
}

export function ZodQuery<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
): ParameterDecorator {
  return Query(new ZodPipe(schema));
}

export function ZodParam<TSchema extends z.ZodTypeAny>(
  name: string,
  schema: TSchema,
): ParameterDecorator {
  return Param(name, new ZodPipe(schema));
}
