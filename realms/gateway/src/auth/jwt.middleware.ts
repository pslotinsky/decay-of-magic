import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UnauthenticatedError } from '@dod/core';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  public async use(req: Request, _res: Response, next: NextFunction) {
    const token = (req.cookies as Record<string, string> | undefined)?.[
      'token'
    ];

    if (!token) {
      throw new UnauthenticatedError('Missing token');
    }

    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: string }>(token);
      req.citizenId = sub;
    } catch {
      throw new UnauthenticatedError('Invalid token');
    }

    next();
  }
}
