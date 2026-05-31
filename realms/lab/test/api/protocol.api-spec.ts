// Behavioral spec for the Protocol HTTP surface. Shapes live in
// `@dod/api-contract` (lab); DOD-0030 builds the realm that turns these green.

describe('ProtocolGate (api)', () => {
  describe('POST /v1/protocol', () => {
    it.todo('creates a Protocol and returns it with a server-generated id');
    it.todo('400 when universeId is missing or does not resolve');
    it.todo('400 when the Universe has no engine bound');
    it.todo('400 when sides is not a 2-tuple');
    it.todo('400 on an unknown character or invalid character params');
    it.todo('400 when a criterionId is unresolved or from another Universe');
    it.todo('400 on a non-positive turnLimit');
  });

  describe('PATCH /v1/protocol/:id', () => {
    it.todo('updates name, sides, and turnLimit');
    it.todo('404 when the Protocol does not exist');
    it.todo('re-applies POST-equivalent validation');
  });

  describe('GET /v1/protocol', () => {
    it.todo('returns the collection (empty array when none exist)');
    it.todo('returns a Protocol by id');
    it.todo('404 for an unknown id');
  });
});
