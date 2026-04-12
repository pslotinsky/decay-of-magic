import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

if (!process.env['DATABASE_URL']) {
  const { POSTGRES_USER, POSTGRES_PASSWORD } = process.env;
  process.env['DATABASE_URL'] =
    `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/citizen_test`;
}
