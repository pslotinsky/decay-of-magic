// Behavioral spec for the Criterion HTTP surface. Shapes live in
// `@dod/api-contract` (lab); DOD-0030 builds the realm that turns these green.

describe('CriterionGate (api)', () => {
  describe('POST /v1/criterion', () => {
    it.todo('creates a Criterion and returns it with a server-generated id');
    it.todo('400 when universeId is missing or does not resolve');
    it.todo('400 on a bad name');
    it.todo('400 on empty weights');
    it.todo('400 when a feature is not in the Universe catalog');
    it.todo('400 on a non-numeric weight');
  });

  describe('PATCH /v1/criterion/:id', () => {
    it.todo('updates name and weights');
    it.todo('404 when the Criterion does not exist');
    it.todo('re-validates weights against the catalog');
  });

  describe('GET /v1/criterion', () => {
    it.todo('filters by universeId');
    it.todo('returns a Criterion by id');
    it.todo('404 for an unknown id');
  });
});
