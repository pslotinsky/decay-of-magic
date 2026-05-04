import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ErrorFilter } from './error.filter';
import { ErrorLogger } from './error.logger';

/**
 * Registers the platform's HTTP error pipeline: a global `ErrorFilter` mapped
 * via `APP_FILTER` (so Nest resolves it through DI) and the `ErrorLogger` it
 * delegates to. Realm app modules just import this and stop wiring filters by
 * hand in `main.ts`.
 */
@Module({
  providers: [ErrorLogger, { provide: APP_FILTER, useClass: ErrorFilter }],
})
export class CoreHttpModule {}
