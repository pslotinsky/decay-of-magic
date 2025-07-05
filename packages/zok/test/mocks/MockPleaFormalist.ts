import { PleaFormalist } from '@zok/domain/assistants';

export class MockPleaFormalist extends PleaFormalist {
  private count: number = 0;

  protected override async issueId(): Promise<string> {
    this.count += 1;

    return this.count.toString();
  }
}
