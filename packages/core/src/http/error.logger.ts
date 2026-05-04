import { Injectable, Logger } from '@nestjs/common';

import type { ErrorEnvelope } from '@dod/api-contract';

type RequestLike = {
  method?: string;
  url?: string;
  originalUrl?: string;
};

/**
 * Formats and logs error responses produced by `ErrorFilter`. Kept separate
 * from the filter so the responsibilities of mapping exceptions and logging
 * them stay independent.
 */
@Injectable()
export class ErrorLogger {
  private readonly logger = new Logger(ErrorLogger.name);

  public log(
    request: RequestLike,
    status: number,
    envelope: ErrorEnvelope,
    exception: unknown,
  ): void {
    const method = request.method ?? 'UNKNOWN';
    const url = request.originalUrl ?? request.url ?? 'unknown';
    const { code, message, details } = envelope.error;
    const detailsSuffix = details?.length
      ? ` details=${JSON.stringify(details)}`
      : '';
    const line = `${method} ${url} -> ${status} ${code}: ${message}${detailsSuffix}`;

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(line, stack);
    } else {
      this.logger.warn(line);
    }
  }
}
