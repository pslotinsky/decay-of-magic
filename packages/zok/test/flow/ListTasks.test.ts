import assert from 'node:assert';
import test, { beforeEach } from 'node:test';

import { Zok } from '@/application/Zok';
import { NotFoundError } from '@/domain/errors';

import { createTask, listDocuments } from '../helpers/document';
import { MockFactory } from '../mocks/MockFactory';

test.describe('Flow: Task list', () => {
  let zok!: Zok;

  beforeEach(async () => {
    zok = MockFactory.createZok();

    await zok.init();
  });

  test('Returns empty list when no tasks exist', async () => {
    const tasks = await listDocuments(zok, 'task');

    assert.deepEqual(tasks, []);
  });

  test('Returns all created tasks', async () => {
    const first = await createTask(zok, { title: 'First task' });
    const second = await createTask(zok, { title: 'Second task' });

    const tasks = await listDocuments(zok, 'task');

    assert.equal(tasks.length, 2);
    assert.ok(tasks.some((task) => task.id === first.id));
    assert.ok(tasks.some((task) => task.id === second.id));
  });

  test('Resolves protocol by alias', async () => {
    await createTask(zok, { title: 'Hello task' });

    const tasks = await listDocuments(zok, 'tasks');

    assert.equal(tasks.length, 1);
  });

  test('Throws NotFoundError for unknown protocol', async () => {
    await assert.rejects(() => listDocuments(zok, 'goblin'), NotFoundError);
  });
});
