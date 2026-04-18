import { ProtocolClerk } from '@/domain/assistants';
import { Dossier } from '@/domain/entities';

import * as protocols from '../fixtures/protocols';

export class MockProtocolClerk extends ProtocolClerk {
  public readonly dossier = new Dossier({
    name: 'Puppet III',
    age: 0,
    race: 'Construct',
    gender: 'none',
    bio: 'A large binder with googly eyes. Does not read the protocols it contains. Purely decorative during test runs.',
  });

  // eslint-disable-next-line @typescript-eslint/require-await
  public override async init(): Promise<void> {
    this.protocols = new Map();

    for (const protocol of Object.values(protocols)) {
      this.protocols.set(protocol.id, protocol);
    }
  }
}
