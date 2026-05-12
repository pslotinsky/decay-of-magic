import assert from 'node:assert';
import test from 'node:test';

import { NotFoundError } from '@/domain/errors';

import * as protocols from '../fixtures/protocols';
import { MockFactory } from '../mocks/MockFactory';

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

  test(`infers protocol from a document id prefix`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    const protocol = protocolist.findByDocumentId('DOD-0001');

    assert.strictEqual(protocol.id, protocols.task.id);
  });

  test(`infers milestone protocol from a milestone id`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    const protocol = protocolist.findByDocumentId('Milestone-006');

    assert.strictEqual(protocol.id, protocols.milestone.id);
  });

  test(`throws NotFoundError when prefix does not match any protocol`, async () => {
    const protocolist = await MockFactory.createInitializedProtocolClerk();

    assert.throws(
      () => protocolist.findByDocumentId('Goblin-0001'),
      NotFoundError,
    );
  });
});
