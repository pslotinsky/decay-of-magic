import {
  type Entity,
  EvalContext,
  ExpressionFactory,
  type Value,
} from '../../src';

class StubContext extends EvalContext {
  public constructor(
    private readonly values: Record<string, Value>,
    public readonly target?: Entity,
  ) {
    super();
  }

  public resolve(path: string): Value {
    return path in this.values ? this.values[path] : path;
  }
}

const factory = new ExpressionFactory();

describe('expression evaluator', () => {
  it('reads a resolved path', () => {
    const ctx = new StubContext({ a: 30 });
    expect(factory.from('a').evaluateNumber(ctx)).toBe(30);
  });

  it('applies arithmetic across resolved paths', () => {
    const ctx = new StubContext({ a: 30, b: 25 });
    expect(factory.from({ sub: ['a', 'b'] }).evaluateNumber(ctx)).toBe(5);
  });

  it('counts a collection', () => {
    const ctx = new StubContext({ minions: [{ stats: {} }, { stats: {} }] });
    expect(factory.from({ count: 'minions' }).evaluateNumber(ctx)).toBe(2);
  });

  it('coerces booleans to 1 / 0', () => {
    const ctx = new StubContext({ a: 30, b: 25 });
    expect(factory.from({ gt: ['a', 'b'] }).evaluateNumber(ctx)).toBe(1);
  });

  it('ranks the context target within a collection by a stat', () => {
    const weak = { stats: { power: 1 } };
    const mid = { stats: { power: 5 } };
    const strong = { stats: { power: 9 } };
    const ctx = new StubContext({ minions: [weak, mid, strong] }, mid);
    expect(
      factory.from({ rankBy: ['minions', 'power'] }).evaluateNumber(ctx),
    ).toBe(2);
  });
});
