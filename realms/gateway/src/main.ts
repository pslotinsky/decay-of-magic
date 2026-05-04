import helmet from 'helmet';
import { NestFactory, Reflector } from '@nestjs/core';

import { EnvelopeInterceptor } from '@dod/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(helmet());
  app.useGlobalInterceptors(new EnvelopeInterceptor(app.get(Reflector)));

  await app.listen(process.env['PORT'] ?? 3000);
}

void bootstrap();
