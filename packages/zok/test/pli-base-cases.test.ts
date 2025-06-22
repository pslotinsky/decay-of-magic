import test, { beforeEach } from 'node:test';
import assert from 'node:assert';

import { Zok } from '../src/application/Zok';

// const archive = new MockArchive();
const zok = Zok.revealItself();

test.describe('Zok PLI. Base cases', () => {
  test(`zok create task "Hello task"`, async () => {
    const remark = await zok.handleTextPlea(`zok create task "Hello task"`);

    console.log(remark);
  });

  test(`zok list tasks`, async () => {});

  test(`zok rename task DOD-0001 "Goodbye task"`, async () => {});

  test(`zok close task DOD-0001`, async () => {});
});
