import type { z } from 'zod';

import {
  CreateUniverseSchema,
  DEFAULT_UNIVERSE_SETTINGS,
  UniverseSchema,
  UniverseSettingsSchema,
  UniverseSummarySchema,
  UpdateUniverseSchema,
} from '../src/contracts/universe';

const accepts = (schema: z.ZodType, input: unknown): void => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `expected valid, got: ${JSON.stringify(result.error.issues)}`,
    );
  }
};

const parse = <TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.infer<TSchema> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `expected valid, got: ${JSON.stringify(result.error.issues)}`,
    );
  }
  return result.data;
};

const rejects = (schema: z.ZodType, input: unknown): void => {
  expect(schema.safeParse(input).success).toBe(false);
};

const validSettings = () => ({
  codex: { cardArt: { aspect: 1, width: 1600 } },
});

const validCreateUniverse = () => ({
  id: 'eldoria',
  name: 'Eldoria',
});

describe('UniverseSettingsSchema', () => {
  it('accepts a valid settings document', () =>
    accepts(UniverseSettingsSchema, validSettings()));

  it('rejects missing codex', () => rejects(UniverseSettingsSchema, {}));

  it('rejects missing cardArt', () =>
    rejects(UniverseSettingsSchema, { codex: {} }));

  it('rejects aspect zero', () =>
    rejects(UniverseSettingsSchema, {
      codex: { cardArt: { aspect: 0, width: 600 } },
    }));

  it('rejects negative aspect', () =>
    rejects(UniverseSettingsSchema, {
      codex: { cardArt: { aspect: -1, width: 600 } },
    }));

  it('rejects aspect above 10', () =>
    rejects(UniverseSettingsSchema, {
      codex: { cardArt: { aspect: 11, width: 600 } },
    }));

  it('rejects width below 64', () =>
    rejects(UniverseSettingsSchema, {
      codex: { cardArt: { aspect: 1, width: 32 } },
    }));

  it('rejects width above 4096', () =>
    rejects(UniverseSettingsSchema, {
      codex: { cardArt: { aspect: 1, width: 5000 } },
    }));

  it('rejects non-integer width', () =>
    rejects(UniverseSettingsSchema, {
      codex: { cardArt: { aspect: 1, width: 600.5 } },
    }));

  it('preserves unknown future realm keys via passthrough', () => {
    const parsed = parse(UniverseSettingsSchema, {
      ...validSettings(),
      battle: { boardSize: 7 },
    });
    expect(parsed).toEqual({
      ...validSettings(),
      battle: { boardSize: 7 },
    });
  });
});

describe('UniverseSummarySchema', () => {
  it('accepts a summary without settings', () =>
    accepts(UniverseSummarySchema, {
      id: 'eldoria',
      name: 'Eldoria',
    }));

  it('strips settings from a payload that includes them', () => {
    const parsed = parse(UniverseSummarySchema, {
      id: 'eldoria',
      name: 'Eldoria',
      settings: validSettings(),
    });
    expect(parsed).not.toHaveProperty('settings');
  });
});

describe('UniverseSchema', () => {
  it('accepts a full universe with settings', () =>
    accepts(UniverseSchema, {
      id: 'eldoria',
      name: 'Eldoria',
      settings: validSettings(),
    }));

  it('rejects when settings are missing', () =>
    rejects(UniverseSchema, {
      id: 'eldoria',
      name: 'Eldoria',
    }));
});

describe('CreateUniverseSchema', () => {
  it('applies default settings when omitted', () => {
    const parsed = parse(CreateUniverseSchema, validCreateUniverse());
    expect(parsed.settings).toEqual(DEFAULT_UNIVERSE_SETTINGS);
  });

  it('echoes explicit settings', () => {
    const settings = {
      codex: { cardArt: { aspect: 0.75, width: 800 } },
    };
    const parsed = parse(CreateUniverseSchema, {
      ...validCreateUniverse(),
      settings,
    });
    expect(parsed.settings).toEqual(settings);
  });

  it('rejects partial codex settings (no nested defaults)', () =>
    rejects(CreateUniverseSchema, {
      ...validCreateUniverse(),
      settings: { codex: {} },
    }));

  it('rejects invalid settings', () =>
    rejects(CreateUniverseSchema, {
      ...validCreateUniverse(),
      settings: { codex: { cardArt: { aspect: 'wide', width: 600 } } },
    }));
});

describe('UpdateUniverseSchema', () => {
  it('accepts an empty payload', () => accepts(UpdateUniverseSchema, {}));

  it('accepts an empty settings object (no realm patched)', () =>
    accepts(UpdateUniverseSchema, { settings: {} }));

  it('accepts a codex realm patch', () =>
    accepts(UpdateUniverseSchema, {
      settings: { codex: { cardArt: { aspect: 1.33, width: 800 } } },
    }));

  it('preserves unknown future realm keys via passthrough', () => {
    const parsed = parse(UpdateUniverseSchema, {
      settings: { battle: { boardSize: 7 } },
    });
    expect(parsed.settings).toEqual({ battle: { boardSize: 7 } });
  });

  it('rejects partial codex sub-object (cardArt required when codex provided)', () =>
    rejects(UpdateUniverseSchema, {
      settings: { codex: {} },
    }));

  it('rejects malformed nested settings', () =>
    rejects(UpdateUniverseSchema, {
      settings: { codex: { cardArt: { aspect: 'bad', width: 600 } } },
    }));
});
