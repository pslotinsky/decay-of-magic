import { type Server } from 'node:http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { CitizenDto } from '../src/frontier/dto/citizen.dto';
import { SessionDto } from '../src/frontier/dto/session.dto';
import { PrismaService } from '../src/ground/prisma.service';

describe('SessionGate (e2e)', () => {
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

  function server(): Server {
    return app.getHttpServer() as Server;
  }

  async function registerCitizen(
    nickname: string,
    password: string,
  ): Promise<CitizenDto> {
    const res = await request(server())
      .post('/api/v1/citizen')
      .send({ nickname, password })
      .expect(201);
    return res.body as CitizenDto;
  }

  describe('POST /api/v1/session', () => {
    it('returns access token for valid credentials', async () => {
      await registerCitizen('Zog', 'secret123');

      const res = await request(server())
        .post('/api/v1/session')
        .send({ nickname: 'Zog', secret: 'secret123' })
        .expect(201);

      expect(typeof (res.body as SessionDto).accessToken).toBe('string');
    });

    it('returns 401 when nickname is not found', () => {
      return request(server())
        .post('/api/v1/session')
        .send({ nickname: 'Unknown', secret: 'secret123' })
        .expect(401);
    });

    it('returns 401 when secret is invalid', async () => {
      await registerCitizen('Zog', 'secret123');

      return request(server())
        .post('/api/v1/session')
        .send({ nickname: 'Zog', secret: 'wrongpassword' })
        .expect(401);
    });

    it('returns 400 when nickname is missing', () => {
      return request(server())
        .post('/api/v1/session')
        .send({ secret: 'some-secret' })
        .expect(400);
    });

    it('returns 400 when secret is missing', () => {
      return request(server())
        .post('/api/v1/session')
        .send({ nickname: 'Zog' })
        .expect(400);
    });

    it('returns 400 when body is empty', () => {
      return request(server()).post('/api/v1/session').send({}).expect(400);
    });
  });
});
