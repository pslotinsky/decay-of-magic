import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { AppModule } from './app.module';

const { CODEX_REALM_URL, VAULT_REALM_URL, CITIZEN_REALM_URL } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const proxies = {
    '/api/v1/card': `${CODEX_REALM_URL}/api/v1/card`,
    '/api/v1/mana': `${CODEX_REALM_URL}/api/v1/mana`,
    '/api/v1/file': `${VAULT_REALM_URL}/api/v1/file`,
    '/api/v1/citizen': `${CITIZEN_REALM_URL}/api/v1/citizen`,
    '/api/v1/session': `${CITIZEN_REALM_URL}/api/v1/session`,
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

void bootstrap();
