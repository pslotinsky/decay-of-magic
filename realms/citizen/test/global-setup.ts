import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

export default function globalSetup() {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

  const { POSTGRES_USER, POSTGRES_PASSWORD } = process.env;
  const databaseUrl =
    process.env['DATABASE_URL'] ??
    `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/citizen_test`;

  try {
    execSync(
      `psql -h localhost -U ${POSTGRES_USER} -d postgres -c 'CREATE DATABASE citizen_test'`,
      { env: { ...process.env, PGPASSWORD: POSTGRES_PASSWORD }, stdio: 'pipe' },
    );
  } catch {
    // database already exists
  }

  execSync('npx prisma migrate deploy', {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  });
}
