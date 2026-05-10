import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import {
  DEFAULT_UNIVERSE_SETTINGS,
  UniverseDto,
  UniverseSummaryDto,
  unwrap,
} from '@dod/api-contract';
import { EnvelopeInterceptor } from '@dod/core';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/ground/prisma.service';

describe('UniverseGate (api)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalInterceptors(new EnvelopeInterceptor(app.get(Reflector)));
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    await prisma.$executeRaw`TRUNCATE TABLE universe CASCADE`;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/universe', () => {
    it('creates universe and returns id and name', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(response.body);

      expect(universe.id).toBeDefined();
      expect(universe.name).toBe('Eldoria');
    });

    it('creates universe with description and cover', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({
          id: 'eldoria',
          name: 'Eldoria',
          description: 'A magical world',
          cover: 'https://example.com/cover.jpg',
        })
        .expect(201);
      const universe = unwrap<UniverseDto>(response.body);

      expect(universe.name).toBe('Eldoria');
      expect(universe.description).toBe('A magical world');
      expect(universe.cover).toBe('https://example.com/cover.jpg');
    });

    it('returns 409 when name already exists', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria-2', name: 'Eldoria' })
        .expect(409);
    });

    it('returns 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({})
        .expect(400);
    });

    it('returns 400 when name is empty', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: '' })
        .expect(400);
    });

    it('returns 400 when name exceeds 100 characters', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'a'.repeat(101) })
        .expect(400);
    });

    it('returns 400 when cover is not a valid URL', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria', cover: 'not-a-url' })
        .expect(400);
    });

    it('returns 400 when description exceeds 500 characters', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria', description: 'a'.repeat(501) })
        .expect(400);
    });

    it('applies default settings when settings are omitted', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(response.body);

      expect(universe.settings).toEqual(DEFAULT_UNIVERSE_SETTINGS);
    });

    it('echoes explicit settings', async () => {
      const settings = {
        codex: { cardArt: { aspect: 1.33, width: 800 } },
      };
      const response = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria', settings })
        .expect(201);
      const universe = unwrap<UniverseDto>(response.body);

      expect(universe.settings).toEqual(settings);
    });

    it('returns 400 when settings.codex.cardArt has invalid aspect', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({
          id: 'eldoria',
          name: 'Eldoria',
          settings: {
            codex: { cardArt: { aspect: -1, width: 600 } },
          },
        })
        .expect(400);
    });

    it('returns 400 when settings.codex omits cardArt', () => {
      return request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({
          id: 'eldoria',
          name: 'Eldoria',
          settings: { codex: {} },
        })
        .expect(400);
    });
  });

  describe('PATCH /api/v1/universe/:id', () => {
    it('updates name', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/universe/${universe.id}`)
        .send({ name: 'Eldoria Reborn' })
        .expect(200);
      const updated = unwrap<UniverseDto>(updateResponse.body);

      expect(updated.name).toBe('Eldoria Reborn');
    });

    it('updates description and cover', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/universe/${universe.id}`)
        .send({
          description: 'Updated description',
          cover: 'https://example.com/new-cover.jpg',
        })
        .expect(200);
      const updated = unwrap<UniverseDto>(updateResponse.body);

      expect(updated.description).toBe('Updated description');
      expect(updated.cover).toBe('https://example.com/new-cover.jpg');
    });

    it('returns 404 when universe not found', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/universe/non-existent-id')
        .send({ name: 'Eldoria' })
        .expect(404);
    });

    it('returns 409 when renaming to an existing universe name', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);

      const secondResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'shadowlands', name: 'Shadowlands' })
        .expect(201);
      const second = unwrap<UniverseDto>(secondResponse.body);

      await request(app.getHttpServer())
        .patch(`/api/v1/universe/${second.id}`)
        .send({ name: 'Eldoria' })
        .expect(409);
    });

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

    it('replaces the codex settings sub-object wholesale', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      const newCardArt = { aspect: 1.33, width: 800 };
      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/universe/${universe.id}`)
        .send({ settings: { codex: { cardArt: newCardArt } } })
        .expect(200);
      const updated = unwrap<UniverseDto>(updateResponse.body);

      expect(updated.settings).toEqual({ codex: { cardArt: newCardArt } });
    });

    it('preserves existing settings when payload omits settings', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/universe/${universe.id}`)
        .send({ name: 'Eldoria Reborn' })
        .expect(200);
      const updated = unwrap<UniverseDto>(updateResponse.body);

      expect(updated.settings).toEqual(DEFAULT_UNIVERSE_SETTINGS);
    });

    it('preserves existing settings when payload sends empty settings', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/universe/${universe.id}`)
        .send({ settings: {} })
        .expect(200);
      const updated = unwrap<UniverseDto>(updateResponse.body);

      expect(updated.settings).toEqual(DEFAULT_UNIVERSE_SETTINGS);
    });

    it('returns 400 when settings payload is invalid', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      return request(app.getHttpServer())
        .patch(`/api/v1/universe/${universe.id}`)
        .send({
          settings: { codex: { cardArt: { aspect: 'wide', width: 600 } } },
        })
        .expect(400);
    });

    it('preserves unknown future realm keys in storage', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      await prisma.universe.update({
        where: { id: universe.id },
        data: {
          settings: {
            ...DEFAULT_UNIVERSE_SETTINGS,
            battle: { boardSize: 7 },
          },
        },
      });

      await request(app.getHttpServer())
        .patch(`/api/v1/universe/${universe.id}`)
        .send({
          settings: {
            codex: { cardArt: { aspect: 1.33, width: 800 } },
          },
        })
        .expect(200);

      const stored = await prisma.universe.findFirstOrThrow({
        where: { id: universe.id },
      });
      expect(stored.settings).toMatchObject({ battle: { boardSize: 7 } });
    });
  });

  describe('GET /api/v1/universe/:id', () => {
    it('returns universe by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);
      const universe = unwrap<UniverseDto>(createResponse.body);

      const getResponse = await request(app.getHttpServer())
        .get(`/api/v1/universe/${universe.id}`)
        .expect(200);
      const found = unwrap<UniverseDto>(getResponse.body);

      expect(found.id).toBe(universe.id);
      expect(found.name).toBe('Eldoria');
      expect(found.settings).toEqual(DEFAULT_UNIVERSE_SETTINGS);
    });

    it('returns 404 when universe not found', () => {
      return request(app.getHttpServer())
        .get('/api/v1/universe/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /api/v1/universe', () => {
    it('returns collection of universes', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'shadowlands', name: 'Shadowlands' })
        .expect(201);

      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/universe')
        .expect(200);
      const universes = unwrap<UniverseSummaryDto[]>(listResponse.body);

      expect(universes).toHaveLength(2);
      expect(universes.map((universe) => universe.name)).toContain('Eldoria');
      expect(universes.map((universe) => universe.name)).toContain(
        'Shadowlands',
      );
    });

    it('omits settings from list items to keep the list light', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/universe')
        .send({ id: 'eldoria', name: 'Eldoria' })
        .expect(201);

      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/universe')
        .expect(200);
      const universes = unwrap<UniverseSummaryDto[]>(listResponse.body);

      expect(universes).toHaveLength(1);
      expect('settings' in universes[0]).toBe(false);
    });

    it('returns empty array when no universes exist', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/universe')
        .expect(200);
      const universes = unwrap<UniverseSummaryDto[]>(listResponse.body);

      expect(universes).toEqual([]);
    });
  });
});
