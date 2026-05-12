import assert from 'node:assert';
import test from 'node:test';

import { DocumentProtocol, PleaType } from '@/domain/entities';

import * as protocols from '../fixtures/protocols';
import { MockFactory } from '../mocks/MockFactory';

test.describe('Unit: PleaFormalist', () => {
  test(`returns Plea with given values and generated id`, async () => {
    const formalist = await MockFactory.createInitializedPleaFormalist();

    const plea = await formalist.formalizePlea({
      type: PleaType.Create,
      protocol: protocols.task.id,
      values: { title: 'Test plea' },
    });

    assert.ok(plea.id);
    assert.strictEqual(plea.type, PleaType.Create);
    assert.strictEqual(plea.protocol, protocols.task.id);
    assert.strictEqual(plea.getValue<string>('title'), 'Test plea');
  });

  test(`uses default values when missing`, async () => {
    const formalist = await MockFactory.createInitializedPleaFormalist();

    const plea = await formalist.formalizePlea({});

    assert.ok(plea.id);
    assert.strictEqual(plea.type, PleaType.Unknown);
    assert.strictEqual(plea.protocol, DocumentProtocol.UnknownId);
    assert.strictEqual(plea.getValue('title'), undefined);
  });
});
