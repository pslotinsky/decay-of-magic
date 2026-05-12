import assert from 'node:assert';
import test, { beforeEach } from 'node:test';

import { Zok } from '@/application/Zok';
import { Document, DocumentLink } from '@/domain/entities';

import {
  createMilestone,
  createTask,
  findMilestone,
} from '../helpers/document';
import { MockFactory } from '../mocks/MockFactory';

test.describe('Flow: Task creation', () => {
  let zok!: Zok;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    assert.equal(
      task.getField<DocumentLink>('parent')?.id,
      inProgressMilestone.id,
    );

    const milestone = await findMilestone(zok, inProgressMilestone.id);
    const { toc } = milestone.metadata;
    assert.ok(toc);
    assert.equal(toc.lines.length, 1);

    const line = toc.lines[0];
    assert.equal(line.id, task.id);
    assert.equal(line.title, task.title);

    assert.ok(
      milestone.content.endsWith(
        [
          '<!-- TOC.START: task -->',
          '- [ ] [DOD-0001: Hello task](../tasks/DOD-0001_hello-task.md)',
          '<!-- TOC.END -->',
          '',
        ].join('\n'),
      ),
    );
  });

  test(`Task can be bind to the required milestone manually`, async () => {
    const task = await createTask(zok, {
      title: 'Hello task',
      parent: plannedMilestone.id,
    });
    assert.equal(
      task.getField<DocumentLink>('parent')?.id,
      plannedMilestone.id,
    );

    const milestone = await findMilestone(zok, plannedMilestone.id);

    const { toc } = milestone.metadata;
    assert.ok(toc);
    assert.equal(toc.lines.length, 1);

    const line = toc.lines[0];
    assert.equal(line.id, task.id);
    assert.equal(line.title, task.title);

    assert.ok(
      milestone.content.endsWith(
        [
          '<!-- TOC.START: task -->',
          '- [ ] [DOD-0001: Hello task](../tasks/DOD-0001_hello-task.md)',
          '<!-- TOC.END -->',
          '',
        ].join('\n'),
      ),
    );
  });
});
