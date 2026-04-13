import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

const COOKIE_NAME = 'token';
const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('/api/v1/session')
export class SessionController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const upstream = await fetch(
      `${process.env['CITIZEN_REALM_URL']}/api/v1/session`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    if (!upstream.ok) {
      const data = (await upstream.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new HttpException(data.message ?? 'Unauthorized', upstream.status);
    }

    const { accessToken } = (await upstream.json()) as { accessToken: string };

    res.cookie(COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: COOKIE_TTL_MS,
      path: '/',
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie(COOKIE_NAME, { path: '/' });
  }
}
