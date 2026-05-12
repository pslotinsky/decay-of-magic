import assert from 'node:assert';
import test from 'node:test';

import { NanoPleaFormalist } from '@/infrastructure/assistants';

test.describe('Integration: NanoPleaFormalist', () => {
  test(`issues unique ids`, async () => {
    const formalist = new NanoPleaFormalist();
    const ids = new Set<string>();

    for (let i = 0; i < 1000; i++) {
      const plea = await formalist.formalizePlea({});

      ids.add(plea.id);
    }

    assert.strictEqual(ids.size, 1000);
  });
});
