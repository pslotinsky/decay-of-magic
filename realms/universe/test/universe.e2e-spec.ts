import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('UniverseGate (e2e)', () => {
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

  describe('POST /api/v1/universe', () => {
    it.todo('creates universe and returns id and name');
    it.todo('creates universe with description and cover');
    it.todo('returns 409 when name already exists');

    it('returns 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({})
        .expect(400);
    });

    it('returns 400 when name is empty', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ name: '' })
        .expect(400);
    });

    it('returns 400 when name exceeds 100 characters', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ name: 'a'.repeat(101) })
        .expect(400);
    });

    it('returns 400 when cover is not a valid URL', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ name: 'Eldoria', cover: 'not-a-url' })
        .expect(400);
    });

    it('returns 400 when description exceeds 500 characters', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ name: 'Eldoria', description: 'a'.repeat(501) })
        .expect(400);
    });
  });

  describe('PATCH /api/v1/universe/:id', () => {
    it.todo('updates name');
    it.todo('updates description and cover');
    it.todo('returns 404 when universe not found');
    it.todo('returns 409 when renaming to an existing universe name');

    it('returns 400 when name is empty', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/universe/some-id')
        .send({ name: '' })
        .expect(400);
    });

    it('returns 400 when cover is not a valid URL', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/universe/some-id')
        .send({ cover: 'not-a-url' })
        .expect(400);
    });
  });

  describe('GET /api/v1/universe/:id', () => {
    it.todo('returns universe by id');
    it.todo('returns 404 when universe not found');
  });

  describe('GET /api/v1/universe', () => {
    it.todo('returns collection of universes');
    it.todo('returns empty array when no universes exist');
  });
});
