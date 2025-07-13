import { describe, it } from 'node:test';
import assert from 'node:assert';

import { DocumentProtocol, Plea, PleaType } from '@zok/domain/entities';
import { NunjucksScribe } from '@zok/infrastructure/assistants';

import * as protocols from 'test/fixtures/protocols';

describe('Integration: NunjucksScribe', () => {
  it('renders document', async () => {
    const scribe = new NunjucksScribe();
    await scribe.init();

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

    assert.match(document.content, /# DOD-0001: Test task/);
    assert.match(document.content, /Status/);
    assert.match(document.content, /Done/);
    assert.match(document.content, /Created/);
    assert.match(document.content, /2025-07-03/);
  });

  it('throws if template is missing', async () => {
    const scribe = new NunjucksScribe();
    await scribe.init();

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

    assert.rejects(async () =>
      scribe.createDocument({
        id: 'DOD-0001',
        protocol: DocumentProtocol.init({
          ...protocol,
          template: 'nonexistent.nj',
        }),
        plea,
      }),
    );
  });
});
