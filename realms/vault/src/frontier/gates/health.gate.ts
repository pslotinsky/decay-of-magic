import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';

import { NoEnvelope } from '@dod/core';

@Controller('/v1/health')
export class HealthGate {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @NoEnvelope()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }
}
