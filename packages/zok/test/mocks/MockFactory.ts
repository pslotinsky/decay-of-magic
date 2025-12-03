import { Assistant } from '@zok/domain/assistants';
import { Zok } from '@zok/application/Zok';

import { MockPleaFormalist } from './MockPleaFormalist';
import { MockProtocolClerk } from './MockProtocolClerk';
import { MockArchiveKeeper } from './MockArchiveKeeper';
import { MockScribe } from './MockScribe';

export class MockFactory {
  public static createZok(): Zok {
    return Zok.revealItself({
      protocolClerk: MockFactory.createProtocolClerk(),
      archiveKeeper: MockFactory.createArchiveKeeper(),
      pleaFormalist: MockFactory.createPleaFormalist(),
      scribe: MockFactory.createScribe(),
    });
  }

  public static createPleaFormalist(): MockPleaFormalist {
    return new MockPleaFormalist();
  }

  static createProtocolClerk(): MockProtocolClerk {
    return new MockProtocolClerk();
  }

  public static createArchiveKeeper(): MockArchiveKeeper {
    return new MockArchiveKeeper();
  }

  public static createScribe(): MockScribe {
    return new MockScribe();
  }

  public static async createInitializedPleaFormalist(): Promise<MockPleaFormalist> {
    return MockFactory.initialize(new MockPleaFormalist());
  }

  public static async createInitializedProtocolClerk(): Promise<MockProtocolClerk> {
    return MockFactory.initialize(new MockProtocolClerk());
  }

  public static async createInitializedArchiveKeeper(): Promise<MockArchiveKeeper> {
    return MockFactory.initialize(new MockArchiveKeeper());
  }

  public static async createInitializedScribe(): Promise<MockScribe> {
    return MockFactory.initialize(new MockScribe());
  }

  private static async initialize<T extends Assistant>(
    assistant: T,
  ): Promise<T> {
    await assistant.init();

    return assistant;
  }
}
