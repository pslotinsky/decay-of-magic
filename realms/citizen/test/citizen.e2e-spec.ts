import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('CitizenGate (e2e)', () => {
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

  describe('POST /api/v1/citizens', () => {
    it.todo('registers citizen and returns id and nickname');
    it.todo('issues CitizenPermit and records issuedAt');
    it.todo('returns 409 when nickname already exists');

    it('returns 400 when nickname is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizens')
        .send({ password: 'secret123' })
        .expect(400);
    });

    it('returns 400 when nickname is not a string', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizens')
        .send({ nickname: 42, password: 'secret123' })
        .expect(400);
    });

    it('returns 400 when nickname is empty', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizens')
        .send({ nickname: '', password: 'secret123' })
        .expect(400);
    });

    it('returns 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizens')
        .send({ nickname: 'Zog' })
        .expect(400);
    });

    it('returns 400 when password is too short', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizens')
        .send({ nickname: 'Zog', password: 'short' })
        .expect(400);
    });
  });

  describe('PATCH /api/v1/citizens/:id', () => {
    it.todo('updates nickname');
    it.todo('does not change id');
    it.todo('returns 404 when citizen not found');

    it('returns 400 when nickname is not a string', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/citizens/some-id')
        .send({ nickname: 42 })
        .expect(400);
    });

    it('returns 400 when nickname is empty', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/citizens/some-id')
        .send({ nickname: '' })
        .expect(400);
    });
  });

  describe('GET /api/v1/citizens/:id', () => {
    it.todo('returns citizen by id');
    it.todo('returns 404 when citizen not found');
  });

  describe('GET /api/v1/citizens', () => {
    it.todo('returns collection of citizens');
    it.todo('returns empty array when no citizens exist');
  });
});
