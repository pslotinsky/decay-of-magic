import test from 'node:test';
import assert from 'node:assert';

import * as protocols from 'test/fixtures/protocols';
import { MockFactory } from 'test/mocks/MockFactory';
import { Document } from '@zok/domain/entities';

test.describe('Unit: ArchiveKeeper', () => {
  test(`issues correct number for task`, async () => {
    const keeper = await MockFactory.createInitializedArchiveKeeper();

    const taskNumber = await keeper.issueDocumentNumber(protocols.task);

    assert.equal(taskNumber, 'DOD-0001');
  });

  test(`issues correct number for milestone`, async () => {
    const keeper = await MockFactory.createInitializedArchiveKeeper();

    const milestoneNumber = await keeper.issueDocumentNumber(
      protocols.milestone,
    );

    assert.equal(milestoneNumber, 'Milestone-001');
  });

  test(`issues correct number for roadmap`, async () => {
    const keeper = await MockFactory.createInitializedArchiveKeeper();

    const roadmapNumber = await keeper.issueDocumentNumber(protocols.roadmap);

    assert.equal(roadmapNumber, 'Roadmap-01');
  });

  test(`task number is increasing`, async () => {
    const keeper = await MockFactory.createInitializedArchiveKeeper();

    const taskNumber = await keeper.issueDocumentNumber(protocols.task);

    await keeper.save(
      Document.issue({
        metadata: {
          id: taskNumber,
          title: 'Test task',
          fields: {},
          protocol: protocols.task,
        },
        content: '',
      }),
    );

    const nextTaskNumber = await keeper.issueDocumentNumber(protocols.task);

    assert.equal(taskNumber, 'DOD-0001');
    assert.equal(nextTaskNumber, 'DOD-0002');
  });
});
