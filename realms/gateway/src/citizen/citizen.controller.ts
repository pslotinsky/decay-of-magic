import { Request } from 'express';
import { Controller, Get, HttpException, Req } from '@nestjs/common';

@Controller('/api/v1/citizen')
export class CitizenController {
  @Get('/me')
  public async me(@Req() req: Request): Promise<unknown> {
    const upstream = await fetch(
      `${process.env['CITIZEN_REALM_URL']}/api/v1/citizen/${req.citizenId}`,
    );
    if (!upstream.ok) {
      throw new HttpException('Not found', upstream.status);
    }
    return upstream.json() as Promise<unknown>;
  }
}
