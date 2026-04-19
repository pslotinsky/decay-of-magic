import helmet from 'helmet';
import { NestFactory, Reflector } from '@nestjs/core';

import {
  createValidationPipe,
  EnvelopeInterceptor,
  ErrorFilter,
} from '@dod/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(helmet());
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(new EnvelopeInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new ErrorFilter());

  await app.listen(process.env['PORT'] ?? 3000);
}

void bootstrap();
