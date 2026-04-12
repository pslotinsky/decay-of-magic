import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

const BEARER_PREFIX = 'Bearer ';

export const BearerToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest<Request>();

    const auth = headers.authorization;
    if (!auth?.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedException('Missing token');
    }

    return auth.slice(BEARER_PREFIX.length);
  },
);
