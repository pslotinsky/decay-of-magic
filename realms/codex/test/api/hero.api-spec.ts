describe('HeroGate (api)', () => {
  describe('POST /api/v1/hero', () => {
    it.todo('creates the resource and returns it');
    it.todo('returns 400 when universeId is missing');
    it.todo('returns 400 when name is missing');
    it.todo('returns 400 when name is empty');
    it.todo('returns 400 when name exceeds max length');
    it.todo('returns 409 when id already exists in the same Universe');
    it.todo('allows the same id in a different Universe');

    describe('elements', () => {
      it.todo('accepts an elements map referencing existing Elements');
      it.todo(
        'returns 400 when elements references an Element not in this Universe',
      );
      it.todo('returns 400 when any elements amount is negative');
    });

    describe('faction', () => {
      it.todo('accepts zero or one faction');
      it.todo(
        'returns 400 when faction references a Faction not in this Universe',
      );
    });

    describe('stats', () => {
      it.todo(
        'returns 400 when stats references a Stat not in this Universe, or one whose appliesTo does not include hero',
      );
    });

    describe('traits', () => {
      it.todo(
        'returns 400 when traits references a Trait not in this Universe, or one whose appliesTo does not include hero',
      );
    });

    describe('abilities', () => {
      it.todo(
        'accepts abilities with the same shape and validation as Card abilities',
      );
    });
  });

  describe('PATCH /api/v1/hero/:id', () => {
    it.todo('updates writable fields');
    it.todo('returns 404 when the resource is not found');
    it.todo('returns 400 when name is empty');

    describe('elements', () => {
      it.todo('accepts an elements map referencing existing Elements');
      it.todo(
        'returns 400 when elements references an Element not in this Universe',
      );
      it.todo('returns 400 when any elements amount is negative');
    });

    describe('faction', () => {
      it.todo('accepts zero or one faction');
      it.todo(
        'returns 400 when faction references a Faction not in this Universe',
      );
    });

    describe('stats', () => {
      it.todo(
        'returns 400 when stats references a Stat not in this Universe, or one whose appliesTo does not include hero',
      );
    });

    describe('traits', () => {
      it.todo(
        'returns 400 when traits references a Trait not in this Universe, or one whose appliesTo does not include hero',
      );
    });

    describe('abilities', () => {
      it.todo(
        'accepts abilities with the same shape and validation as Card abilities',
      );
    });
  });

  describe('GET /api/v1/hero/:id', () => {
    it.todo('returns the resource by id');
    it.todo('returns 404 when the resource is not found');
  });

  describe('GET /api/v1/hero?universeId=:id', () => {
    it.todo('returns resources for that Universe');
    it.todo(
      'returns empty array when the Universe has no resources of this kind',
    );
    it.todo('returns empty array when universeId does not exist');
    it.todo('does not return resources from other Universes');
  });
});
