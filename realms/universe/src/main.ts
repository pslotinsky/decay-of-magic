import { NestFactory, Reflector } from '@nestjs/core';

import { EnvelopeInterceptor, ErrorFilter } from '@dod/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalInterceptors(new EnvelopeInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new ErrorFilter());

  await app.listen(process.env.PORT ?? 3004);
}

void bootstrap();
