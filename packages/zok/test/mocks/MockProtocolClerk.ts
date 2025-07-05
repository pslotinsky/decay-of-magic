import { ProtocolClerk } from '@zok/domain/assistants';

import * as protocols from '../fixtures/protocols';

export class MockProtocolClerk extends ProtocolClerk {
  public override async init(): Promise<void> {
    this.protocols = new Map(Object.entries(protocols));
  }
}
