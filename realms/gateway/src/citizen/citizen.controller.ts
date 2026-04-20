import { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('/api/v1/citizen')
export class CitizenController {
  @Get('/me')
  public async me(@Req() req: Request, @Res() res: Response): Promise<void> {
    const upstream = await fetch(
      `${process.env['CITIZEN_REALM_URL']}/api/v1/citizen/${req.citizenId}`,
    );
    const body = (await upstream.json()) as unknown;
    res.status(upstream.status).json(body);
  }
}
