import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';

import { NoEnvelope } from '@dod/core';

@Controller('/v1/health')
@ApiTags('Health')
export class HealthGate {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @NoEnvelope()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }
}
