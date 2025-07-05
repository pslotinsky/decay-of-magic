import test, { before, beforeEach } from 'node:test';
import assert from 'node:assert';

import { MockArchiveKeeper } from 'test/mocks/MockArchiveKeeper';
import * as protocols from 'test/fixtures/protocols';

const keeper = new MockArchiveKeeper();

test.describe('Unit: ArchiveKeeper', () => {
  beforeEach(() => keeper.reset());

  test(`issues correct number for task`, async () => {
    const taskNumber = await keeper.issueDocumentNumber(protocols.task);

    assert.strictEqual(taskNumber, 'DOD-0001');
  });

  test(`issues correct number for milestone`, async () => {
    const milestoneNumber = await keeper.issueDocumentNumber(
      protocols.milestone,
    );

    assert.strictEqual(milestoneNumber, 'Milestone-001');
  });

  test(`issues correct number for roadmap`, async () => {
    const roadmapNumber = await keeper.issueDocumentNumber(protocols.roadmap);

    assert.strictEqual(roadmapNumber, 'Roadmap-01');
  });
});
