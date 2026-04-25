describe('ElementGate (api)', () => {
  describe('POST /api/v1/element', () => {
    it.todo('creates the resource and returns it');
    it.todo('returns 400 when universeId is missing');
    it.todo('returns 400 when name is missing');
    it.todo('returns 400 when name is empty');
    it.todo('returns 400 when name exceeds max length');
    it.todo('returns 409 when id already exists in the same Universe');
    it.todo('allows the same id in a different Universe');
  });

  describe('PATCH /api/v1/element/:id', () => {
    it.todo('updates writable fields');
    it.todo('returns 404 when the resource is not found');
    it.todo('returns 400 when name is empty');
  });

  describe('GET /api/v1/element/:id', () => {
    it.todo('returns the resource by id');
    it.todo('returns 404 when the resource is not found');
  });

  describe('GET /api/v1/element?universeId=:id', () => {
    it.todo('returns resources for that Universe');
    it.todo(
      'returns empty array when the Universe has no resources of this kind',
    );
    it.todo('returns empty array when universeId does not exist');
    it.todo('does not return resources from other Universes');
  });
});
