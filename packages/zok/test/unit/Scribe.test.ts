import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isEqual } from 'date-fns';

import { Plea, PleaType } from '@zok/domain/entities';

import * as protocols from 'test/fixtures/protocols';
import { MockFactory } from 'test/mocks/MockFactory';

describe('Unit: Scribe', () => {
  it('creates a Document from Plea', async () => {
    const scribe = await MockFactory.createInitializedScribe();
    const protocol = protocols.task;
    const plea = Plea.make('plea-id-1', {
      type: PleaType.Create,
      protocol: protocol.id,
      values: {
        title: 'Test task',
        status: 'Done',
        created: new Date('2025-07-03'),
      },
    });

    const document = await scribe.createDocument({
      id: 'DOD-0001',
      protocol,
      plea,
    });

    assert.strictEqual(document.id, 'DOD-0001');
    assert.strictEqual(document.metadata.protocol, protocol);
    assert.strictEqual(document.metadata.title, 'Test task');
    assert.strictEqual(document.getValue('status'), 'Done');
    assert.ok(isEqual(document.getValue('created')!, '2025-07-03'));
    assert.match(document.content, /# DOD-0001: Test task/);
  });

  it('fills defaults if Plea is missing fields', async () => {
    const scribe = await MockFactory.createInitializedScribe();
    const protocol = protocols.task;
    const plea = Plea.make('plea-id-2', {
      type: PleaType.Create,
      protocol: protocol.id,
    });

    const document = await scribe.createDocument({
      id: 'DOD-0002',
      plea,
      protocol,
    });

    assert.strictEqual(document.metadata.title, 'Untitled');
    assert.strictEqual(document.getValue('status'), 'In progress');
    assert.ok(document.getValue('created') instanceof Date);
  });

  it('normalizes values using protocol', async () => {
    const scribe = await MockFactory.createInitializedScribe();
    const protocol = protocols.task;
    const plea = Plea.make('plea-id-3', {
      type: PleaType.Create,
      protocol: protocol.id,
      values: {
        created: '2025-07-03',
      },
    });

    const document = await scribe.createDocument({
      id: 'DOD-0003',
      plea,
      protocol,
    });

    assert.ok(document.getValue('created') instanceof Date);
  });
});
