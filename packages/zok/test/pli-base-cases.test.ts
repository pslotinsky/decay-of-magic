import test, { before, beforeEach } from 'node:test';
import assert from 'node:assert';

import { Zok } from '../src/application/Zok';
import { YamlProtocolClerk } from '@zok/infrastructure/assistants/YamlProtocolClerk';

// const archive = new MockArchive();
const zok = Zok.revealItself({
  protocolClerk: new YamlProtocolClerk(),
});

test.describe('Zok PLI. Base cases', () => {
  before(async () => {
    await zok.init();
  });

  test(`zok create task "Hello task"`, async () => {
    const remark = await zok.handleTextPlea(`zok create task "Hello task"`);

    console.log(remark);
  });

  test(`zok list tasks`, async () => {});

  test(`zok rename task DOD-0001 "Goodbye task"`, async () => {});

  test(`zok close task DOD-0001`, async () => {});
});
