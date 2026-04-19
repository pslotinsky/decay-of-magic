import { type Server } from 'node:http';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { CitizenDto, SessionDto, unwrap } from '@dod/api-contract';
import { EnvelopeInterceptor, ErrorFilter } from '@dod/core';

import { AppModule } from '../src/app.module';
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
    app.useGlobalInterceptors(new EnvelopeInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new ErrorFilter());
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
    secret: string,
  ): Promise<CitizenDto> {
    const response = await request(server())
      .post('/api/v1/citizen')
      .send({ nickname, secret })
      .expect(201);
    return unwrap<CitizenDto>(response.body);
  }

  describe('POST /api/v1/session', () => {
    it('returns access token for valid credentials', async () => {
      await registerCitizen('Zog', 'secret123');

      const response = await request(server())
        .post('/api/v1/session')
        .send({ nickname: 'Zog', secret: 'secret123' })
        .expect(201);
      const session = unwrap<SessionDto>(response.body);

      expect(typeof session.accessToken).toBe('string');
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
