import cookieParser from 'cookie-parser';
import { json } from 'express';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { JwtMiddleware } from './auth/jwt.middleware';
import { CitizenController } from './citizen/citizen.controller';
import { SessionController } from './session/session.controller';

const {
  CODEX_REALM_URL,
  VAULT_REALM_URL,
  CITIZEN_REALM_URL,
  UNIVERSE_REALM_URL,
} = process.env;

@Module({
  imports: [
    JwtModule.register({
      secret: process.env['JWT_SECRET'] ?? 'dev-secret',
    }),
  ],
  controllers: [CitizenController, SessionController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');

    consumer.apply(json()).forRoutes(SessionController);

    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/api/v1/session', method: RequestMethod.POST },
        { path: '/api/v1/session', method: RequestMethod.DELETE },
      )
      .forRoutes('*');

    consumer
      .apply(
        createProxyMiddleware({
          target: `${CITIZEN_REALM_URL}/api/v1/citizen`,
          changeOrigin: true,
        }),
      )
      .exclude({ path: '/api/v1/citizen/me', method: RequestMethod.GET })
      .forRoutes('/api/v1/citizen');

    consumer
      .apply(
        createProxyMiddleware({
          target: `${CODEX_REALM_URL}/api/v1/card`,
          changeOrigin: true,
        }),
      )
      .forRoutes('/api/v1/card');

    consumer
      .apply(
        createProxyMiddleware({
          target: `${CODEX_REALM_URL}/api/v1/mana`,
          changeOrigin: true,
        }),
      )
      .forRoutes('/api/v1/mana');

    consumer
      .apply(
        createProxyMiddleware({
          target: `${VAULT_REALM_URL}/api/v1/file`,
          changeOrigin: true,
        }),
      )
      .forRoutes('/api/v1/file');

    consumer
      .apply(
        createProxyMiddleware({
          target: `${UNIVERSE_REALM_URL}/api/v1/universe`,
          changeOrigin: true,
        }),
      )
      .forRoutes('/api/v1/universe');
  }
}
