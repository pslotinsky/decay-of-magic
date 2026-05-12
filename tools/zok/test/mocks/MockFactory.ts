import { Zok } from '@/application/Zok';
import type { Assistant } from '@/domain/assistants';

import { MockArchiveKeeper } from './MockArchiveKeeper';
import { MockPleaFormalist } from './MockPleaFormalist';
import { MockProtocolClerk } from './MockProtocolClerk';
import { MockScribe } from './MockScribe';

export const MockFactory = {
  createZok(): Zok {
    return Zok.revealItself({
      protocolClerk: MockFactory.createProtocolClerk(),
      archiveKeeper: MockFactory.createArchiveKeeper(),
      pleaFormalist: MockFactory.createPleaFormalist(),
      scribe: MockFactory.createScribe(),
    });
  },

  createPleaFormalist(): MockPleaFormalist {
    return new MockPleaFormalist();
  },

  createProtocolClerk(): MockProtocolClerk {
    return new MockProtocolClerk();
  },

  createArchiveKeeper(): MockArchiveKeeper {
    return new MockArchiveKeeper();
  },

  createScribe(): MockScribe {
    return new MockScribe();
  },

  async createInitializedPleaFormalist(): Promise<MockPleaFormalist> {
    return initialize(new MockPleaFormalist());
  },

  async createInitializedProtocolClerk(): Promise<MockProtocolClerk> {
    return initialize(new MockProtocolClerk());
  },

  async createInitializedArchiveKeeper(): Promise<MockArchiveKeeper> {
    return initialize(new MockArchiveKeeper());
  },

  async createInitializedScribe(): Promise<MockScribe> {
    return initialize(new MockScribe());
  },
};

async function initialize<T extends Assistant>(assistant: T): Promise<T> {
  await assistant.init();

  return assistant;
}
