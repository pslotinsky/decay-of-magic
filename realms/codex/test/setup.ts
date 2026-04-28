import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const baseUrl = process.env['DATABASE_URL'];
if (!baseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const url = new URL(baseUrl);
url.pathname = url.pathname + '_test';
process.env['DATABASE_URL'] = url.toString();
