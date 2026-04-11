import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('SessionGate (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/sessions', () => {
    it.todo('returns JWT access token for valid credentials');
    it.todo('returns 401 when nickname is not found');
    it.todo('returns 401 when secret is invalid');

    it('returns 400 when nickname is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sessions')
        .send({ secret: 'some-secret' })
        .expect(400);
    });

    it('returns 400 when secret is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sessions')
        .send({ nickname: 'Zog' })
        .expect(400);
    });

    it('returns 400 when body is empty', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sessions')
        .send({})
        .expect(400);
    });
  });

  describe('Token validation', () => {
    it.todo('verifies token signature');
    it.todo('verifies token is not expired');
    it.todo('returns citizenId from a valid token');
    it.todo('returns 401 for an invalid token');
    it.todo('returns 401 for an expired token');
  });
});
