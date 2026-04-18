import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { CitizenDto } from '../src/frontier/dto/citizen.dto';
import { PrismaService } from '../src/ground/prisma.service';

describe('CitizenGate (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    await prisma.$executeRaw`TRUNCATE TABLE citizen_permit, citizen CASCADE`;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/citizen', () => {
    it('registers citizen and returns id and nickname', async () => {
      const citizen = (
        await request(app.getHttpServer())
          .post('/api/v1/citizen')
          .send({ nickname: 'Zog', secret: 'secret123' })
          .expect(201)
      ).body as CitizenDto;

      expect(citizen.id).toBeDefined();
      expect(citizen.nickname).toBe('Zog');
    });

    it('issues CitizenPermit and records issuedAt', async () => {
      const citizen = (
        await request(app.getHttpServer())
          .post('/api/v1/citizen')
          .send({ nickname: 'Zog', secret: 'secret123' })
          .expect(201)
      ).body as CitizenDto;

      const permit = await prisma.citizenPermit.findFirst({
        where: { id: citizen.id },
      });
      expect(permit).toBeDefined();
      expect(permit!.issuedAt).toBeInstanceOf(Date);
    });

    it('returns 409 when nickname already exists', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: 'Zog', secret: 'secret123' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: 'Zog', secret: 'another123' })
        .expect(409);
    });

    it('returns 400 when nickname is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ secret: 'secret123' })
        .expect(400);
    });

    it('returns 400 when nickname is not a string', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: 42, secret: 'secret123' })
        .expect(400);
    });

    it('returns 400 when nickname is empty', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: '', secret: 'secret123' })
        .expect(400);
    });

    it('returns 400 when secret is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: 'Zog' })
        .expect(400);
    });

    it('returns 400 when secret is too short', () => {
      return request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: 'Zog', secret: 'short' })
        .expect(400);
    });
  });

  describe('PATCH /api/v1/citizen/:id', () => {
    it('updates nickname', async () => {
      const citizen = (
        await request(app.getHttpServer())
          .post('/api/v1/citizen')
          .send({ nickname: 'Zog', secret: 'secret123' })
          .expect(201)
      ).body as CitizenDto;

      const updated = (
        await request(app.getHttpServer())
          .patch(`/api/v1/citizen/${citizen.id}`)
          .send({ nickname: 'ZogUpdated' })
          .expect(200)
      ).body as CitizenDto;

      expect(updated.nickname).toBe('ZogUpdated');
    });

    it('does not change id', async () => {
      const citizen = (
        await request(app.getHttpServer())
          .post('/api/v1/citizen')
          .send({ nickname: 'Zog', secret: 'secret123' })
          .expect(201)
      ).body as CitizenDto;

      const updated = (
        await request(app.getHttpServer())
          .patch(`/api/v1/citizen/${citizen.id}`)
          .send({ nickname: 'ZogUpdated' })
          .expect(200)
      ).body as CitizenDto;

      expect(updated.id).toBe(citizen.id);
    });

    it('returns 404 when citizen not found', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/citizen/non-existent-id')
        .send({ nickname: 'Zog' })
        .expect(404);
    });

    it('returns 400 when nickname is not a string', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/citizen/some-id')
        .send({ nickname: 42 })
        .expect(400);
    });

    it('returns 400 when nickname is empty', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/citizen/some-id')
        .send({ nickname: '' })
        .expect(400);
    });
  });

  describe('GET /api/v1/citizen/:id', () => {
    it('returns citizen by id', async () => {
      const citizen = (
        await request(app.getHttpServer())
          .post('/api/v1/citizen')
          .send({ nickname: 'Zog', secret: 'secret123' })
          .expect(201)
      ).body as CitizenDto;

      const found = (
        await request(app.getHttpServer())
          .get(`/api/v1/citizen/${citizen.id}`)
          .expect(200)
      ).body as CitizenDto;

      expect(found.id).toBe(citizen.id);
      expect(found.nickname).toBe('Zog');
    });

    it('returns 404 when citizen not found', () => {
      return request(app.getHttpServer())
        .get('/api/v1/citizen/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /api/v1/citizen', () => {
    it('returns collection of citizens', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: 'Zog', secret: 'secret123' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname: 'Mog', secret: 'secret123' })
        .expect(201);

      const citizens = (
        await request(app.getHttpServer()).get('/api/v1/citizen').expect(200)
      ).body as CitizenDto[];

      expect(citizens).toHaveLength(2);
      expect(citizens.map((c) => c.nickname)).toContain('Zog');
      expect(citizens.map((c) => c.nickname)).toContain('Mog');
    });

    it('returns empty array when no citizens exist', async () => {
      const citizens = (
        await request(app.getHttpServer()).get('/api/v1/citizen').expect(200)
      ).body as CitizenDto[];

      expect(citizens).toEqual([]);
    });
  });
});
