import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { CitizenDto } from '../src/frontier/dto/citizen.dto';
import { SessionDto } from '../src/frontier/dto/session.dto';
import { TokenPayloadDto } from '../src/frontier/dto/token-payload.dto';
import { PrismaService } from '../src/ground/prisma.service';

describe('SessionGate (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    jwtService = moduleFixture.get(JwtService);
    await prisma.$executeRaw`TRUNCATE TABLE citizen_permit, citizen CASCADE`;
  });

  afterEach(async () => {
    await app.close();
  });

  async function registerCitizen(
    nickname: string,
    password: string,
  ): Promise<CitizenDto> {
    return (
      await request(app.getHttpServer())
        .post('/api/v1/citizen')
        .send({ nickname, password })
        .expect(201)
    ).body as CitizenDto;
  }

  async function createSession(
    nickname: string,
    secret: string,
  ): Promise<SessionDto> {
    return (
      await request(app.getHttpServer())
        .post('/api/v1/session')
        .send({ nickname, secret })
        .expect(201)
    ).body as SessionDto;
  }

  describe('POST /api/v1/session', () => {
    it('returns JWT access token for valid credentials', async () => {
      await registerCitizen('Zog', 'secret123');
      const session = await createSession('Zog', 'secret123');

      expect(session.accessToken).toBeDefined();
    });

    it('returns 401 when nickname is not found', () => {
      return request(app.getHttpServer())
        .post('/api/v1/session')
        .send({ nickname: 'Unknown', secret: 'secret123' })
        .expect(401);
    });

    it('returns 401 when secret is invalid', async () => {
      await registerCitizen('Zog', 'secret123');

      return request(app.getHttpServer())
        .post('/api/v1/session')
        .send({ nickname: 'Zog', secret: 'wrongpassword' })
        .expect(401);
    });

    it('returns 400 when nickname is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/session')
        .send({ secret: 'some-secret' })
        .expect(400);
    });

    it('returns 400 when secret is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/session')
        .send({ nickname: 'Zog' })
        .expect(400);
    });

    it('returns 400 when body is empty', () => {
      return request(app.getHttpServer())
        .post('/api/v1/session')
        .send({})
        .expect(400);
    });
  });

  describe('Token validation', () => {
    it('verifies token signature', async () => {
      await registerCitizen('Zog', 'secret123');
      const session = await createSession('Zog', 'secret123');
      const tamperedToken = session.accessToken.slice(0, -5) + 'XXXXX';

      return request(app.getHttpServer())
        .get('/api/v1/session')
        .set('Authorization', `Bearer ${tamperedToken}`)
        .expect(401);
    });

    it('verifies token is not expired', async () => {
      await registerCitizen('Zog', 'secret123');
      const session = await createSession('Zog', 'secret123');

      return request(app.getHttpServer())
        .get('/api/v1/session')
        .set('Authorization', `Bearer ${session.accessToken}`)
        .expect(200);
    });

    it('returns citizenId from a valid token', async () => {
      const citizen = await registerCitizen('Zog', 'secret123');
      const session = await createSession('Zog', 'secret123');

      const payload = (
        await request(app.getHttpServer())
          .get('/api/v1/session')
          .set('Authorization', `Bearer ${session.accessToken}`)
          .expect(200)
      ).body as TokenPayloadDto;

      expect(payload.citizenId).toBe(citizen.id);
    });

    it('returns 401 for an invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/session')
        .set('Authorization', 'Bearer not-a-valid-jwt')
        .expect(401);
    });

    it('returns 401 for an expired token', async () => {
      const citizen = await registerCitizen('Zog', 'secret123');
      const expiredToken = jwtService.sign(
        { sub: citizen.id },
        { expiresIn: -1 },
      );

      return request(app.getHttpServer())
        .get('/api/v1/session')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });
});
