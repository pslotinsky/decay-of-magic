import { useMemo } from 'react';

import type { ErrorDetail, ErrorEnvelope } from '@dod/api-contract';

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: ErrorDetail[];

  public constructor(status: number, envelope: ErrorEnvelope) {
    super(envelope.error.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = envelope.error.code;
    this.details = envelope.error.details ?? [];
  }
}

export function useFieldErrors(error: unknown): Record<string, string> {
  return useMemo(() => {
    return error instanceof ApiError ? toFieldErrors(error) : {};
  }, [error]);
}

function toFieldErrors(error: ApiError): Record<string, string> {
  const map: Record<string, string> = {};

  for (const detail of error.details) {
    if (detail.field && !(detail.field in map)) {
      map[detail.field] = detail.message;
    }
  }

  return map;
}
