import { map, Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { NO_ENVELOPE_KEY } from './no-envelope.decorator';

@Injectable()
export class EnvelopeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const skip = this.reflector.getAllAndOverride<boolean>(NO_ENVELOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return next.handle().pipe(
      map((payload: unknown) => {
        if (skip) return payload;
        if (payload === null || payload === undefined) return payload;
        return { data: payload };
      }),
    );
  }
}
