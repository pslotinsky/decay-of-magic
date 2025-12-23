import test, { beforeEach } from 'node:test';
import assert from 'node:assert';

import { Zok } from '@zok/application/Zok';
import { Document } from '@zok/domain/entities';

import { MockFactory } from 'test/mocks/MockFactory';
import {
  createMilestone,
  createTask,
  findMilestone,
} from 'test/helpers/document';

test.describe('Flow: Task creation', () => {
  let zok!: Zok;

  let doneMilestone!: Document;
  let plannedMilestone!: Document;
  let inProgressMilestone!: Document;

  beforeEach(async () => {
    zok = MockFactory.createZok();

    await zok.init();

    doneMilestone = await createMilestone(zok, { status: 'Done' });
    inProgressMilestone = await createMilestone(zok, { status: 'In progress' });
    plannedMilestone = await createMilestone(zok, { status: 'Planned' });
  });

  test(`Task automatically binds to the active milestone`, async () => {
    const task = await createTask(zok, { title: 'Hello task' });
    assert.equal(task.getField('parent'), inProgressMilestone.id);

    const milestone = await findMilestone(zok, inProgressMilestone.id);
    const { toc } = milestone.metadata;
    assert.ok(toc);
    assert.equal(toc.lines.length, 1);

    const line = toc.lines[0];
    assert.equal(line.id, task.id);
    assert.equal(line.title, task.title);
  });

  test(`Task can be bind to the required milestone manually`, async () => {
    const task = await createTask(zok, {
      title: 'Hello task',
      parent: plannedMilestone.id,
    });
    assert.equal(task.getField('parent'), plannedMilestone.id);

    const milestone = await findMilestone(zok, plannedMilestone.id);

    const { toc } = milestone.metadata;
    assert.ok(toc);
    assert.equal(toc.lines.length, 1);

    const line = toc.lines[0];
    assert.equal(line.id, task.id);
    assert.equal(line.title, task.title);
  });
});
