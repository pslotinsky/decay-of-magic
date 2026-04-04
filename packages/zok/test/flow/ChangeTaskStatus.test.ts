import test, { beforeEach } from 'node:test';
import assert from 'node:assert';

import { Zok } from '@zok/application/Zok';
import { Document } from '@zok/domain/entities';
import { NotFoundError, UnexpectedValueError } from '@zok/domain/errors';

import { MockFactory } from 'test/mocks/MockFactory';
import {
  changeTaskStatus,
  createMilestone,
  createTask,
  findMilestone,
} from 'test/helpers/document';

test.describe('Flow: Task status change', () => {
  let zok!: Zok;

  let task!: Document;
  let milestone!: Document;

  beforeEach(async () => {
    zok = MockFactory.createZok();

    await zok.init();

    milestone = await createMilestone(zok, { status: 'In progress' });
    task = await createTask(zok, { title: 'Hello task' });
  });

  test('Closing a task marks it as Done', async () => {
    const updated = await changeTaskStatus(zok, task.id, 'done');

    assert.equal(updated.getField('status'), 'Done');
  });

  test('Closing a task updates the parent milestone TOC', async () => {
    await changeTaskStatus(zok, task.id, 'done');

    const updatedMilestone = await findMilestone(zok, milestone.id);

    assert.ok(
      updatedMilestone.content.endsWith(
        [
          '<!-- TOC.START: task -->',
          '- [x] [DOD-0001: Hello task](../tasks/DOD-0001_hello-task.md)',
          '<!-- TOC.END -->',
          '',
        ].join('\n'),
      ),
    );
  });

  test('Cancelling a task updates the parent milestone TOC', async () => {
    await changeTaskStatus(zok, task.id, 'cancelled');

    const updatedMilestone = await findMilestone(zok, milestone.id);

    assert.ok(
      updatedMilestone.content.endsWith(
        [
          '<!-- TOC.START: task -->',
          '- [ ] ~~[DOD-0001: Hello task](../tasks/DOD-0001_hello-task.md)~~',
          '<!-- TOC.END -->',
          '',
        ].join('\n'),
      ),
    );
  });

  test('Throws NotFoundError when task does not exist', async () => {
    await assert.rejects(
      () => changeTaskStatus(zok, 'DOD-9999', 'done'),
      NotFoundError,
    );
  });

  test('Throws UnexpectedValueError when status key is unknown', async () => {
    await assert.rejects(
      () => changeTaskStatus(zok, task.id, 'goblin'),
      UnexpectedValueError,
    );
  });
});
