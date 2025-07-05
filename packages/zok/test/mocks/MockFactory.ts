import { Assistant } from '@zok/domain/assistants';

import { MockPleaFormalist } from './MockPleaFormalist';
import { MockProtocolClerk } from './MockProtocolClerk';
import { MockArchiveKeeper } from './MockArchiveKeeper';

export class MockFactory {
  public static createPleaFormalist(): MockPleaFormalist {
    return new MockPleaFormalist();
  }

  static createProtocolClerk(): MockProtocolClerk {
    return new MockProtocolClerk();
  }

  public static createArchiveKeeper(): MockArchiveKeeper {
    return new MockArchiveKeeper();
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

  private static async initialize<T extends Assistant>(
    assistant: T,
  ): Promise<T> {
    await assistant.init();

    return assistant;
  }
}
