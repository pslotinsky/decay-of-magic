import test from 'node:test';
import assert from 'node:assert';

import * as protocols from 'test/fixtures/protocols';
import { MockFactory } from 'test/mocks/MockFactory';

import { NotFoundError } from '@zok/domain/errors';

test.describe('Unit: ProtocolClerk', () => {
  test(`returns protocol when it exists`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    const protocol = await protocolist.getProtocol(protocols.task.id);

    assert.equal(protocol, protocols.task);
  });

  test(`throws NotFoundError when protocol is missing`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    assert.throws(() => protocolist.getProtocol('goblin'), NotFoundError);
  });
});
