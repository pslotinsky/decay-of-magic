import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';

import { NoEnvelope } from '@dod/core';

@Controller('/api/v1/health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @NoEnvelope()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }
}
