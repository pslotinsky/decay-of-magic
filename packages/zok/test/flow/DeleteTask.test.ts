import assert from 'node:assert';
import test, { beforeEach } from 'node:test';

import { Zok } from '@/application/Zok';
import { Document } from '@/domain/entities';
import { NotFoundError } from '@/domain/errors';

import {
  createMilestone,
  createTask,
  deleteTask,
  findMilestone,
  listDocuments,
} from '../helpers/document';
import { MockFactory } from '../mocks/MockFactory';

test.describe('Flow: Task deletion', () => {
  let zok!: Zok;

  let milestone!: Document;
  let task!: Document;

  beforeEach(async () => {
    zok = MockFactory.createZok();

    await zok.init();

    milestone = await createMilestone(zok, { status: 'In progress' });
    task = await createTask(zok, { title: 'Hello task' });
  });

  test('Deleted task is no longer in the archive', async () => {
    await deleteTask(zok, task.id);

    const tasks = await listDocuments(zok, 'task');

    assert.equal(tasks.length, 0);
  });

  test('Returns the deleted document', async () => {
    const deleted = await deleteTask(zok, task.id);

    assert.equal(deleted.id, task.id);
    assert.equal(deleted.title, task.title);
  });

  test('Deleted task is removed from parent milestone TOC', async () => {
    await deleteTask(zok, task.id);

    const updatedMilestone = await findMilestone(zok, milestone.id);
    const { toc } = updatedMilestone.metadata;

    assert.ok(toc);
    assert.equal(toc.lines.length, 0);
  });

  test('Throws NotFoundError when task does not exist', async () => {
    await assert.rejects(() => deleteTask(zok, 'DOD-9999'), NotFoundError);
  });
});
