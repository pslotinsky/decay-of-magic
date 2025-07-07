import test, { before } from 'node:test';

import { Zok } from '@zok/application/Zok';
import { PleaType } from '@zok/domain/entities';

import { MockFactory } from 'test/mocks/MockFactory';

const zok = Zok.revealItself({
  archiveKeeper: MockFactory.createArchiveKeeper(),
  pleaFormalist: MockFactory.createPleaFormalist(),
  protocolClerk: MockFactory.createProtocolClerk(),
  scribe: MockFactory.createScribe(),
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
