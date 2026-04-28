import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

export default function globalSetup() {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

  const baseUrl = process.env['DATABASE_URL'];
  if (!baseUrl) throw new Error('DATABASE_URL is not set');

  const url = new URL(baseUrl);
  url.pathname = url.pathname + '_test';
  const databaseUrl = url.toString();
  const dbName = url.pathname.slice(1);

  try {
    execSync(
      `psql -h ${url.hostname} -p ${url.port || '5432'} -U ${decodeURIComponent(url.username)} -d postgres -c 'CREATE DATABASE "${dbName}"'`,
      {
        env: { ...process.env, PGPASSWORD: decodeURIComponent(url.password) },
        stdio: 'pipe',
      },
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
