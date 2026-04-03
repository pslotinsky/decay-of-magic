import test, { beforeEach } from 'node:test';
import assert from 'node:assert';

import { Zok } from '@zok/application/Zok';
import { Document } from '@zok/domain/entities';
import { NotFoundError } from '@zok/domain/errors';

import { MockFactory } from 'test/mocks/MockFactory';
import {
  createMilestone,
  createTask,
  findMilestone,
  findTask,
  renameMilestone,
  renameTask,
} from 'test/helpers/document';

test.describe('Flow: Rename task', () => {
  let zok!: Zok;

  let task!: Document;
  let milestone!: Document;

  beforeEach(async () => {
    zok = MockFactory.createZok();

    await zok.init();

    milestone = await createMilestone(zok, { status: 'In progress' });
    task = await createTask(zok, { title: 'Hello task' });
  });

  test('Updates task title', async () => {
    await renameTask(zok, task.id, 'Renamed task');

    const updated = await findTask(zok, task.id);

    assert.equal(updated.title, 'Renamed task');
  });

  test('Updates task heading in content', async () => {
    await renameTask(zok, task.id, 'Renamed task');

    const updated = await findTask(zok, task.id);

    assert.ok(updated.content.startsWith('# DOD-0001: Renamed task'));
  });

  test('Updates parent milestone TOC with new title', async () => {
    await renameTask(zok, task.id, 'Renamed task');

    const updated = await findMilestone(zok, milestone.id);

    assert.ok(
      updated.content.endsWith(
        [
          '<!-- TOC.START: task -->',
          '- [ ] [DOD-0001: Renamed task](../tasks/DOD-0001_renamed-task.md)',
          '<!-- TOC.END -->',
          '',
        ].join('\n'),
      ),
    );
  });

  test('Renaming a milestone updates parent link in tasks', async () => {
    await renameMilestone(zok, milestone.id, 'Renamed milestone');

    const updated = await findTask(zok, task.id);

    assert.ok(
      updated.content.includes(
        '[Renamed milestone](../milestones/Milestone-001_renamed-milestone.md)',
      ),
    );
  });

  test('Throws NotFoundError when task does not exist', async () => {
    await assert.rejects(
      () => renameTask(zok, 'DOD-9999', 'New title'),
      NotFoundError,
    );
  });
});
