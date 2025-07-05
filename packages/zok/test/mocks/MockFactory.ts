import { Assistant } from '@zok/domain/assistants';

import { MockArchiveKeeper } from './MockArchiveKeeper';
import { MockPleaFormalist } from './MockPleaFormalist';

export class MockFactory {
  public static createPleaFormalist(): MockPleaFormalist {
    return new MockPleaFormalist();
  }

  public static createArchiveKeeper(): MockArchiveKeeper {
    return new MockArchiveKeeper();
  }

  public static async createInitializedPleaFormalist(): Promise<MockPleaFormalist> {
    return MockFactory.initialize(new MockPleaFormalist());
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
