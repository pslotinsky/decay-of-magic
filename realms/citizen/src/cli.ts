import { config } from 'dotenv';
import { CommandService } from 'nestjs-command';
import path from 'node:path';
import { NestFactory } from '@nestjs/core';

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
