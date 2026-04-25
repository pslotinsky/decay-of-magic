describe('CardGate (api)', () => {
  describe('POST /api/v1/card', () => {
    it.todo('creates the resource and returns it');
    it.todo('returns 400 when universeId is missing');
    it.todo('returns 400 when name is missing');
    it.todo('returns 400 when name is empty');
    it.todo('returns 400 when name exceeds max length');
    it.todo('returns 409 when id already exists in the same Universe');
    it.todo('allows the same id in a different Universe');

    describe('references', () => {
      it.todo('accepts a cost referencing existing Elements of this Universe');
      it.todo(
        'returns 400 when cost references an Element not in this Universe',
      );
      it.todo('returns 400 when any cost amount is zero or negative');
      it.todo(
        'accepts factions referencing existing Factions of this Universe',
      );
      it.todo(
        'returns 400 when factions references a Faction not in this Universe',
      );
    });

    describe('dictionary references', () => {
      it.todo('returns 400 when stats references a Stat not in this Universe');
      it.todo(
        'returns 400 when traits references a Trait not in this Universe',
      );
      it.todo(
        "returns 400 when a stats slug's appliesTo doesn't include minion (summon-style cards) or card (spell cards)",
      );
      it.todo(
        "returns 400 when a traits slug's appliesTo doesn't include the entity type the card produces",
      );
      it.todo(
        "returns 400 when an effect's giveTraits / removeTraits references a Trait not in this Universe",
      );
      it.todo(
        "returns 400 when an effect's increaseStat / decreaseStat / multiplyStat / setStat references a Stat not in this Universe",
      );
    });

    describe('activation/stats coupling', () => {
      it.todo('requires stats when activation is emptySlot');
      it.todo(
        'returns 400 when stats is present and activation is anything other than emptySlot',
      );
    });

    describe('abilities — shape', () => {
      it.todo('accepts an Ability with one or more Effects');
      it.todo('returns 400 when an Ability has an empty effects array');
      it.todo(
        'returns 400 when an Ability has neither trigger nor passive: true',
      );
      it.todo('returns 400 when an Ability has both trigger and passive: true');
      it.todo(
        "returns 400 when an Ability's trigger is not a known Trigger value",
      );
      it.todo(
        "returns 400 when an Ability's target is not a known Target slug",
      );
    });

    describe('abilities — chosen references', () => {
      it.todo(
        'returns 400 when chosen appears (as target, in exclude, or in any Expression) on a card with activation: immediate',
      );
    });

    describe('effects', () => {
      it.todo("returns 400 when an Effect's kind is not a registered effect");
      it.todo(
        "returns 400 when an Effect's params violate the kind's declared schema",
      );
      it.todo(
        'returns 400 when a gainElement param references an Element not in this Universe',
      );
      it.todo(
        "returns 400 when a summon effect's minion references a Card not in this Universe (or one whose activation is not emptySlot)",
      );
    });

    describe('expressions', () => {
      it.todo('returns 400 when a dotted-path read uses an unknown root');
      it.todo('returns 400 when a structured operator uses an unknown key');
      it.todo(
        "returns 400 when a structured operator's operand count violates the operator's arity",
      );
    });
  });

  describe('PATCH /api/v1/card/:id', () => {
    it.todo('updates writable fields');
    it.todo('returns 404 when the resource is not found');
    it.todo('returns 400 when name is empty');

    describe('references', () => {
      it.todo('accepts a cost referencing existing Elements of this Universe');
      it.todo(
        'returns 400 when cost references an Element not in this Universe',
      );
      it.todo('returns 400 when any cost amount is zero or negative');
      it.todo(
        'accepts factions referencing existing Factions of this Universe',
      );
      it.todo(
        'returns 400 when factions references a Faction not in this Universe',
      );
    });

    describe('dictionary references', () => {
      it.todo('returns 400 when stats references a Stat not in this Universe');
      it.todo(
        'returns 400 when traits references a Trait not in this Universe',
      );
      it.todo(
        "returns 400 when a stats slug's appliesTo doesn't include minion (summon-style cards) or card (spell cards)",
      );
      it.todo(
        "returns 400 when a traits slug's appliesTo doesn't include the entity type the card produces",
      );
      it.todo(
        "returns 400 when an effect's giveTraits / removeTraits references a Trait not in this Universe",
      );
      it.todo(
        "returns 400 when an effect's increaseStat / decreaseStat / multiplyStat / setStat references a Stat not in this Universe",
      );
    });

    describe('activation/stats coupling', () => {
      it.todo('requires stats when activation is emptySlot');
      it.todo(
        'returns 400 when stats is present and activation is anything other than emptySlot',
      );
    });

    describe('abilities — shape', () => {
      it.todo('accepts an Ability with one or more Effects');
      it.todo('returns 400 when an Ability has an empty effects array');
      it.todo(
        'returns 400 when an Ability has neither trigger nor passive: true',
      );
      it.todo('returns 400 when an Ability has both trigger and passive: true');
      it.todo(
        "returns 400 when an Ability's trigger is not a known Trigger value",
      );
      it.todo(
        "returns 400 when an Ability's target is not a known Target slug",
      );
    });

    describe('abilities — chosen references', () => {
      it.todo(
        'returns 400 when chosen appears (as target, in exclude, or in any Expression) on a card with activation: immediate',
      );
    });

    describe('effects', () => {
      it.todo("returns 400 when an Effect's kind is not a registered effect");
      it.todo(
        "returns 400 when an Effect's params violate the kind's declared schema",
      );
      it.todo(
        'returns 400 when a gainElement param references an Element not in this Universe',
      );
      it.todo(
        "returns 400 when a summon effect's minion references a Card not in this Universe (or one whose activation is not emptySlot)",
      );
    });

    describe('expressions', () => {
      it.todo('returns 400 when a dotted-path read uses an unknown root');
      it.todo('returns 400 when a structured operator uses an unknown key');
      it.todo(
        "returns 400 when a structured operator's operand count violates the operator's arity",
      );
    });
  });

  describe('GET /api/v1/card/:id', () => {
    it.todo('returns the resource by id');
    it.todo('returns 404 when the resource is not found');
  });

  describe('GET /api/v1/card?universeId=:id', () => {
    it.todo('returns resources for that Universe');
    it.todo(
      'returns empty array when the Universe has no resources of this kind',
    );
    it.todo('returns empty array when universeId does not exist');
    it.todo('does not return resources from other Universes');
  });
});
