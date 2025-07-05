import test from 'node:test';
import assert from 'node:assert';

import * as protocols from 'test/fixtures/protocols';
import { MockFactory } from 'test/mocks/MockFactory';

import { PleaType } from '@zok/domain/plea';
import { DocumentProtocol } from '@zok/domain/document';

test.describe('Unit: PleaFormalist', () => {
  test(`returns Plea with given values and generated id`, async () => {
    const formalist = await MockFactory.createInitializedPleaFormalist();

    const plea = await formalist.formalizePlea({
      type: PleaType.Create,
      protocol: protocols.task.id,
      values: { title: 'Test plea' },
    });

    assert.ok(plea.id);
    assert.equal(plea.type, PleaType.Create);
    assert.equal(plea.protocol, protocols.task.id);
    assert.equal(plea.getValue<string>('title'), 'Test plea');
  });

  test(`uses default values when missing`, async () => {
    const formalist = await MockFactory.createInitializedPleaFormalist();

    const plea = await formalist.formalizePlea({});

    assert.ok(plea.id);
    assert.equal(plea.type, PleaType.Unknown);
    assert.equal(plea.protocol, DocumentProtocol.UnknownId);
    assert.equal(plea.getValue('title'), undefined);
  });
});
