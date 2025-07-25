import test from 'node:test';
import assert from 'node:assert';

import { NanoPleaFormalist } from '@zok/infrastructure/assistants';

test.describe('Integration: NanoPleaFormalist', () => {
  test(`issues unique ids`, async () => {
    const formalist = new NanoPleaFormalist();
    const ids = new Set<string>();

    for (let i = 0, plea; i < 1000; i++) {
      plea = await formalist.formalizePlea({});

      ids.add(plea.id);
    }

    assert.strictEqual(ids.size, 1000);
  });
});
