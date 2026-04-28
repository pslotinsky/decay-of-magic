import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';
import { INestApplication } from '@nestjs/common';

import { unwrap } from '@dod/api-contract';

export async function postOk<T>(
  app: INestApplication,
  path: string,
  body: object,
): Promise<T> {
  const response = await http(app).post(path).send(body).expect(201);

  return unwrap<T>(response.body);
}

export async function patchOk<T>(
  app: INestApplication,
  path: string,
  body: object,
): Promise<T> {
  const response = await http(app).patch(path).send(body).expect(200);

  return unwrap<T>(response.body);
}

export async function getOk<T>(
  app: INestApplication,
  path: string,
): Promise<T> {
  const response = await http(app).get(path).expect(200);

  return unwrap<T>(response.body);
}

export function http(app: INestApplication): TestAgent {
  return request(app.getHttpServer() as Parameters<typeof request>[0]);
}
