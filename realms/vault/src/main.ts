import { INestApplication } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {
  createValidationPipe,
  EnvelopeInterceptor,
  ErrorFilter,
} from '@dod/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(new EnvelopeInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new ErrorFilter());

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Vault realm')
    .setDescription('File realm API')
    .setVersion('1.0')
    .addTag('vault')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
}

void bootstrap();
