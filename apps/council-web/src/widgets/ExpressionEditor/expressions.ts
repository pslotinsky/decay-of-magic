import { COLLECTION_VALUES, type Expression } from '@dod/api-contract';

import type { ExpressionEditorContextValue } from './context';

export type Mode = 'number' | 'boolean' | 'literalString' | 'path' | 'operator';

export const PATH_ROOTS = [
  'self',
  'ownerHero',
  'enemyHero',
  'target',
  'chosen',
  'event',
] as const;

export { COLLECTION_VALUES };

const LIST_FIELDS = ['traits', 'factions'] as const;

interface FieldGroup {
  label: string;
  options: string[];
}

export const BINARY_OPERATORS = [
  'eq',
  'ne',
  'lt',
  'lte',
  'gt',
  'gte',
  'sub',
  'div',
  'contains',
  'maxBy',
  'rankBy',
] as const;
export const TERNARY_OPERATORS = ['sumTopBy'] as const;
export const VARIADIC_OPERATORS = [
  'and',
  'or',
  'add',
  'mul',
  'min',
  'max',
] as const;
export const UNARY_OPERATORS = ['not', 'ceil', 'count'] as const;

type BinaryOp = (typeof BINARY_OPERATORS)[number];
type TernaryOp = (typeof TERNARY_OPERATORS)[number];
type VariadicOp = (typeof VARIADIC_OPERATORS)[number];
type UnaryOp = (typeof UNARY_OPERATORS)[number];
export type AnyOp = BinaryOp | TernaryOp | VariadicOp | UnaryOp;

const ALL_OPERATORS: AnyOp[] = [
  ...BINARY_OPERATORS,
  ...TERNARY_OPERATORS,
  ...VARIADIC_OPERATORS,
  ...UNARY_OPERATORS,
];
const OPERATOR_SET = new Set<string>(ALL_OPERATORS);

export type ListKind = 'trait' | 'faction';

export function detectMode(value: Expression): Mode {
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'string') {
    return looksLikePath(value) ? 'path' : 'literalString';
  }
  if (detectOperator(value) !== null) {
    return 'operator';
  }
  return 'number';
}

export function defaultForMode(mode: Mode): Expression {
  switch (mode) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'literalString':
      return '';
    case 'path':
      return 'self';
    case 'operator':
      return { eq: [0, 0] };
  }
}

const PATH_PATTERN = /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$/;

function looksLikePath(value: string): boolean {
  return PATH_PATTERN.test(value);
}

export function detectListKind(value: Expression): ListKind | null {
  if (typeof value !== 'string') {
    return null;
  }
  if (/\.traits$/.test(value)) {
    return 'trait';
  }
  if (/\.factions$/.test(value)) {
    return 'faction';
  }
  return null;
}

export function detectOperator(value: Expression): AnyOp | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const keys = Object.keys(value);
  if (keys.length !== 1) {
    return null;
  }
  const key = keys[0]!;
  return OPERATOR_SET.has(key) ? (key as AnyOp) : null;
}

export function operatorOperands(value: Expression, op: AnyOp): Expression[] {
  if (typeof value !== 'object' || value === null) {
    return [];
  }
  const slot = (value as Record<string, unknown>)[op];
  if (Array.isArray(slot)) {
    return slot as Expression[];
  }
  if (slot !== undefined) {
    return [slot as Expression];
  }
  return [];
}

export function buildOperator(op: AnyOp, operands: Expression[]): Expression {
  if (arity(op) === 'unary') {
    return { [op]: operands[0] ?? 0 } as Expression;
  }
  return { [op]: operands } as Expression;
}

export type OperandKind = 'expression' | 'collection' | 'statSlug' | 'number';

export interface OperandSpec {
  kind: OperandKind;
  label: string;
}

interface OperatorSignature {
  args?: OperandSpec[];
  variadic?: OperandSpec;
}

const EXPR_LEFT: OperandSpec = { kind: 'expression', label: 'left' };
const EXPR_RIGHT: OperandSpec = { kind: 'expression', label: 'right' };
const VARIADIC_OPERAND: OperandSpec = { kind: 'expression', label: 'operand' };

const OPERATOR_SIGNATURES: Record<AnyOp, OperatorSignature> = {
  not: { args: [{ kind: 'expression', label: 'value' }] },
  ceil: { args: [{ kind: 'expression', label: 'value' }] },
  count: { args: [{ kind: 'collection', label: 'collection' }] },
  eq: { args: [EXPR_LEFT, EXPR_RIGHT] },
  ne: { args: [EXPR_LEFT, EXPR_RIGHT] },
  lt: { args: [EXPR_LEFT, EXPR_RIGHT] },
  lte: { args: [EXPR_LEFT, EXPR_RIGHT] },
  gt: { args: [EXPR_LEFT, EXPR_RIGHT] },
  gte: { args: [EXPR_LEFT, EXPR_RIGHT] },
  sub: {
    args: [
      { kind: 'expression', label: 'minuend' },
      { kind: 'expression', label: 'subtrahend' },
    ],
  },
  div: {
    args: [
      { kind: 'expression', label: 'numerator' },
      { kind: 'expression', label: 'denominator' },
    ],
  },
  contains: {
    args: [
      { kind: 'expression', label: 'list' },
      { kind: 'expression', label: 'item' },
    ],
  },
  maxBy: {
    args: [
      { kind: 'collection', label: 'collection' },
      { kind: 'statSlug', label: 'stat' },
    ],
  },
  rankBy: {
    args: [
      { kind: 'collection', label: 'collection' },
      { kind: 'statSlug', label: 'rank by' },
    ],
  },
  sumTopBy: {
    args: [
      { kind: 'collection', label: 'collection' },
      { kind: 'number', label: 'top N' },
      { kind: 'statSlug', label: 'by stat' },
    ],
  },
  and: { variadic: VARIADIC_OPERAND },
  or: { variadic: VARIADIC_OPERAND },
  add: { variadic: VARIADIC_OPERAND },
  mul: { variadic: VARIADIC_OPERAND },
  min: { variadic: VARIADIC_OPERAND },
  max: { variadic: VARIADIC_OPERAND },
};

export function operandSpec(op: AnyOp, index: number): OperandSpec {
  const sig = OPERATOR_SIGNATURES[op];
  if (sig.args && index < sig.args.length) {
    return sig.args[index]!;
  }
  if (sig.variadic) {
    return sig.variadic;
  }
  return { kind: 'expression', label: 'value' };
}

export function defaultForKind(kind: OperandKind): Expression {
  switch (kind) {
    case 'collection':
      return 'enemyMinions';
    case 'statSlug':
      return '';
    case 'number':
      return 0;
    case 'expression':
      return 0;
  }
}

export function defaultOperands(op: AnyOp): Expression[] {
  const sig = OPERATOR_SIGNATURES[op];
  if (sig.args) {
    return sig.args.map((spec) => defaultForKind(spec.kind));
  }
  if (sig.variadic) {
    return [
      defaultForKind(sig.variadic.kind),
      defaultForKind(sig.variadic.kind),
    ];
  }
  return [0, 0];
}

export function arity(op: AnyOp): 'unary' | 'binary' | 'ternary' | 'variadic' {
  if ((UNARY_OPERATORS as readonly string[]).includes(op)) {
    return 'unary';
  }
  if ((BINARY_OPERATORS as readonly string[]).includes(op)) {
    return 'binary';
  }
  if ((TERNARY_OPERATORS as readonly string[]).includes(op)) {
    return 'ternary';
  }
  return 'variadic';
}

export function fieldGroups(
  ctx: ExpressionEditorContextValue | null,
): FieldGroup[] {
  const groups: FieldGroup[] = [{ label: 'lists', options: [...LIST_FIELDS] }];
  if (!ctx) {
    return groups;
  }
  if (ctx.elements.length > 0) {
    groups.push({
      label: 'elements',
      options: ctx.elements.map((entry) => `elements.${entry.id}`),
    });
  }
  if (ctx.stats.length > 0) {
    groups.push({
      label: 'stats',
      options: ctx.stats.map((entry) => `stats.${entry.id}`),
    });
  }
  return groups;
}
