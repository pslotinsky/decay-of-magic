import test, { before, beforeEach } from 'node:test';
import assert from 'node:assert';

import { Zok } from '../src/application/Zok';
import {
  NanoPleaFormalist,
  YamlProtocolClerk,
} from '@zok/infrastructure/assistants';
import { PleaType } from '@zok/domain/PleaType';

// const archive = new MockArchive();
const zok = Zok.revealItself({
  formalist: new NanoPleaFormalist(),
  protocolClerk: new YamlProtocolClerk(),
});

test.describe('Zok PLI. Base cases', () => {
  before(async () => {
    await zok.init();
  });

  test(`zok create task "Hello task"`, async () => {
    const remark = await zok.handleTextPlea({
      protocol: 'task',
      type: PleaType.Create,
      values: { title: 'Hello task' },
    });

    console.log(remark);
  });

  test(`zok list tasks`, async () => {});

  test(`zok rename task DOD-0001 "Goodbye task"`, async () => {});

  test(`zok close task DOD-0001`, async () => {});
});
