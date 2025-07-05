import test, { before } from 'node:test';

import { Zok } from '@zok/application/Zok';
import { PleaType } from '@zok/domain/plea';

import { MockArchiveKeeper } from 'test/mocks/MockArchiveKeeper';
import { MockPleaFormalist } from 'test/mocks/MockPleaFormalist';
import { MockProtocolClerk } from 'test/mocks/MockProtocolClerk';

const zok = Zok.revealItself({
  archiveKeeper: new MockArchiveKeeper(),
  pleaFormalist: new MockPleaFormalist(),
  protocolClerk: new MockProtocolClerk(),
});

test.describe('Flow: Positive cases', () => {
  before(async () => {
    await zok.init();
  });

  test(`zok create task "Hello task"`, async () => {
    const remark = await zok.handleTextPlea({
      protocol: 'task',
      type: PleaType.Create,
      values: { title: 'Hello task' },
    });

    console.log(remark); // TODO: assert remark
  });

  test(`zok list tasks`, async () => {});

  test(`zok rename task DOD-0001 "Goodbye task"`, async () => {});

  test(`zok close task DOD-0001`, async () => {});
});
