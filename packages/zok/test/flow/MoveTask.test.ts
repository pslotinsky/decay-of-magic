import test, { beforeEach } from 'node:test';
import assert from 'node:assert';

import { Zok } from '@zok/application/Zok';
import { Document, DocumentLink } from '@zok/domain/entities';
import { NotFoundError } from '@zok/domain/errors';

import { MockFactory } from 'test/mocks/MockFactory';
import {
  createMilestone,
  createTask,
  findMilestone,
  moveTask,
} from 'test/helpers/document';

test.describe('Flow: Move task', () => {
  let zok!: Zok;

  let fromMilestone!: Document;
  let toMilestone!: Document;
  let task!: Document;

  beforeEach(async () => {
    zok = MockFactory.createZok();

    await zok.init();

    fromMilestone = await createMilestone(zok, { status: 'In progress' });
    toMilestone = await createMilestone(zok, { status: 'Planned' });
    task = await createTask(zok, { title: 'Hello task' });
  });

  test('Moving a task updates its parent field', async () => {
    const moved = await moveTask(zok, task.id, toMilestone.id);

    assert.equal(moved.getField<DocumentLink>('parent')?.id, toMilestone.id);
  });

  test('Moving a task adds it to the new milestone TOC', async () => {
    await moveTask(zok, task.id, toMilestone.id);

    const updated = await findMilestone(zok, toMilestone.id);

    assert.ok(
      updated.content.includes(
        '- [ ] [DOD-0001: Hello task](../tasks/DOD-0001_hello-task.md)',
      ),
    );
  });

  test('Moving a task removes it from the old milestone TOC', async () => {
    await moveTask(zok, task.id, toMilestone.id);

    const updated = await findMilestone(zok, fromMilestone.id);

    assert.ok(
      !updated.content.includes(
        '[DOD-0001: Hello task](../tasks/DOD-0001_hello-task.md)',
      ),
    );
  });

  test('Throws NotFoundError when task does not exist', async () => {
    await assert.rejects(
      () => moveTask(zok, 'DOD-9999', toMilestone.id),
      NotFoundError,
    );
  });

  test('Throws NotFoundError when target milestone does not exist', async () => {
    await assert.rejects(
      () => moveTask(zok, task.id, 'Milestone-999'),
      NotFoundError,
    );
  });
});
