import path from 'node:path';

import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { CommandService } from 'nestjs-command';

import { CliModule } from './cli/cli.module';

config({ path: path.resolve(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: false,
  });

  try {
    await app.get(CommandService).exec();
  } finally {
    await app.close();
  }
}

void bootstrap();
