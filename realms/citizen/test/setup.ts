import * as path from 'node:path';

import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

process.env.JWT_SECRET ??= 'test-secret';

const baseUrl = process.env.DATABASE_URL;
if (!baseUrl) throw new Error('DATABASE_URL is not set');

const url = new URL(baseUrl);
url.pathname = `${url.pathname}_test`;
process.env.DATABASE_URL = url.toString();
