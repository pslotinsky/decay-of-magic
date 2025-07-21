import test from 'node:test';
import assert from 'node:assert';

import * as protocols from 'test/fixtures/protocols';
import { MockFactory } from 'test/mocks/MockFactory';

import { NotFoundError } from '@zok/domain/errors';

test.describe('Unit: ProtocolClerk', () => {
  test(`returns protocol when it exists`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    const protocol = protocolist.getProtocol(protocols.task.id);

    assert.strictEqual(protocol.id, protocols.task.id);
  });

  test(`resolves protocol by alias`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    const protocol = protocolist.getProtocol(protocols.task.aliases[0]);

    assert.strictEqual(protocol.id, protocols.task.id);
  });

  test(`throws NotFoundError when protocol is missing`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    assert.throws(() => protocolist.getProtocol('goblin'), NotFoundError);
  });
});
