import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  public async use(req: Request, _res: Response, next: NextFunction) {
    const token = (req.cookies as Record<string, string> | undefined)?.[
      'token'
    ];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: string }>(token);
      req.citizenId = sub;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
