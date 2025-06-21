import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { AppModule } from './app.module';

const { CODEX_SERVICE_URL, VAULT_SERVICE_URL } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const proxies = {
    '/api/v1/card': `${CODEX_SERVICE_URL}/api/v1/card`,
    '/api/v1/mana': `${CODEX_SERVICE_URL}/api/v1/mana`,
    '/api/v1/file': `${VAULT_SERVICE_URL}/api/v1/file`,
  };

  for (const [route, target] of Object.entries(proxies)) {
    app.use(
      route,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        logger: console,
      }),
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
