import {
  CreateCriterionSchema,
  CreateExperimentSchema,
  CreateProtocolSchema,
  GuineaPigSchema,
} from '../src/contracts/lab';

describe('lab contracts', () => {
  describe('GuineaPigSchema', () => {
    it('accepts characters without params', () => {
      expect(GuineaPigSchema.safeParse({ character: 'random' }).success).toBe(
        true,
      );
      expect(GuineaPigSchema.safeParse({ character: 'greedy' }).success).toBe(
        true,
      );
    });

    it('requires a positive depth for lookahead', () => {
      expect(
        GuineaPigSchema.safeParse({ character: 'lookahead', depth: 3 }).success,
      ).toBe(true);
      expect(
        GuineaPigSchema.safeParse({ character: 'lookahead' }).success,
      ).toBe(false);
      expect(
        GuineaPigSchema.safeParse({ character: 'lookahead', depth: 0 }).success,
      ).toBe(false);
    });

    it('rejects an unknown character', () => {
      expect(GuineaPigSchema.safeParse({ character: 'genius' }).success).toBe(
        false,
      );
    });
  });

  describe('CreateProtocolSchema', () => {
    const side = {
      guineaPig: { character: 'greedy' },
      criterionId: crypto.randomUUID(),
    };

    it('accepts a well-formed protocol', () => {
      const result = CreateProtocolSchema.safeParse({
        universeId: 'eldoria',
        sides: [side, side],
        turnLimit: 50,
      });
      expect(result.success).toBe(true);
    });

    it('requires exactly two sides', () => {
      expect(
        CreateProtocolSchema.safeParse({
          universeId: 'eldoria',
          sides: [side],
          turnLimit: 50,
        }).success,
      ).toBe(false);
    });

    it('rejects a non-positive turnLimit', () => {
      expect(
        CreateProtocolSchema.safeParse({
          universeId: 'eldoria',
          sides: [side, side],
          turnLimit: 0,
        }).success,
      ).toBe(false);
    });
  });

  describe('CreateCriterionSchema', () => {
    it('requires at least one weight', () => {
      expect(
        CreateCriterionSchema.safeParse({
          universeId: 'eldoria',
          name: 'Aggro lean',
          weights: [],
        }).success,
      ).toBe(false);
    });

    it('accepts negative weights', () => {
      expect(
        CreateCriterionSchema.safeParse({
          universeId: 'eldoria',
          name: 'Aggro lean',
          weights: [{ feature: 'enemyHeroHealth', weight: -1.5 }],
        }).success,
      ).toBe(true);
    });
  });

  describe('CreateExperimentSchema', () => {
    it('requires a trialCount of at least one', () => {
      const protocolId = crypto.randomUUID();
      expect(
        CreateExperimentSchema.safeParse({ protocolId, trialCount: 1 }).success,
      ).toBe(true);
      expect(
        CreateExperimentSchema.safeParse({ protocolId, trialCount: 0 }).success,
      ).toBe(false);
    });
  });
});
