import { Assistant } from '@zok/domain/assistants';

import { MockArchiveKeeper } from './MockArchiveKeeper';

export class MockFactory {
  public static createArchiveKeeper(): MockArchiveKeeper {
    return new MockArchiveKeeper();
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
