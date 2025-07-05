import test from 'node:test';
import assert from 'node:assert';

import { MockArchiveKeeper } from 'test/mocks/MockArchiveKeeper';
import * as protocols from 'test/fixtures/protocols';
import { MockFactory } from 'test/mocks/MockFactory';

test.describe('Unit: ArchiveKeeper', () => {
  test(`issues correct number for task`, async () => {
    const keeper = await MockFactory.createInitializedArchiveKeeper();

    const taskNumber = await keeper.issueDocumentNumber(protocols.task);

    assert.strictEqual(taskNumber, 'DOD-0001');
  });

  test(`issues correct number for milestone`, async () => {
    const keeper = await MockFactory.createInitializedArchiveKeeper();

    const milestoneNumber = await keeper.issueDocumentNumber(
      protocols.milestone,
    );

    assert.strictEqual(milestoneNumber, 'Milestone-001');
  });

  test(`issues correct number for roadmap`, async () => {
    const keeper = await MockFactory.createInitializedArchiveKeeper();

    const roadmapNumber = await keeper.issueDocumentNumber(protocols.roadmap);

    assert.strictEqual(roadmapNumber, 'Roadmap-01');
  });
});
