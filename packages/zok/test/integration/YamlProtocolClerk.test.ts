import test from 'node:test';
import assert from 'node:assert';

import { YamlProtocolClerk } from '@zok/infrastructure/assistants';

test.describe('Integration: YamlProtocolClerk', () => {
  test(`loads protocols from yaml`, async () => {
    const protocolist = new YamlProtocolClerk();
    await protocolist.init();

    assert.ok(protocolist.hasProtocol('milestone'));
    assert.ok(protocolist.hasProtocol('task'));
    assert.ok(protocolist.hasProtocol('idea'));
  });
});
