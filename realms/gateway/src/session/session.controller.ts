import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';

import { SuccessEnvelope } from '@dod/api-contract';

const COOKIE_NAME = 'token';
const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type SessionPayload = { accessToken: string };

@Controller('/api/v1/session')
export class SessionController {
  @Post()
  public async create(
    @Body() body: unknown,
    @Res() res: Response,
  ): Promise<void> {
    const upstream = await fetch(
      `${process.env['CITIZEN_REALM_URL']}/api/v1/session`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    const upstreamBody = (await upstream.json().catch(() => ({}))) as unknown;

    if (!upstream.ok) {
      res.status(upstream.status).json(upstreamBody);
      return;
    }

    const { data } = upstreamBody as SuccessEnvelope<SessionPayload>;

    res.cookie(COOKIE_NAME, data.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env['NODE_ENV'] === 'production',
      maxAge: COOKIE_TTL_MS,
      path: '/',
    });
    res.status(HttpStatus.CREATED).end();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie(COOKIE_NAME, { path: '/' });
  }
}
