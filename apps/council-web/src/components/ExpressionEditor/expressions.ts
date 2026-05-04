import type { Expression } from '@dod/api-contract';

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

export const LIST_FIELDS = ['traits', 'factions'] as const;
export const CUSTOM_FIELD = '__custom__';

export interface FieldGroup {
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
] as const;
export const VARIADIC_OPERATORS = [
  'and',
  'or',
  'add',
  'mul',
  'min',
  'max',
] as const;
export const UNARY_OPERATORS = ['not'] as const;

export type BinaryOp = (typeof BINARY_OPERATORS)[number];
export type VariadicOp = (typeof VARIADIC_OPERATORS)[number];
export type UnaryOp = (typeof UNARY_OPERATORS)[number];
export type AnyOp = BinaryOp | VariadicOp | UnaryOp;

const ALL_OPERATORS: AnyOp[] = [
  ...BINARY_OPERATORS,
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

export function looksLikePath(value: string): boolean {
  const head = value.split('.')[0];
  return (PATH_ROOTS as readonly string[]).includes(head ?? '');
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

export function defaultOperands(op: AnyOp): Expression[] {
  return arity(op) === 'unary' ? [0] : [0, 0];
}

export function arity(op: AnyOp): 'unary' | 'binary' | 'variadic' {
  if ((UNARY_OPERATORS as readonly string[]).includes(op)) {
    return 'unary';
  }
  if ((BINARY_OPERATORS as readonly string[]).includes(op)) {
    return 'binary';
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

export function flattenFields(groups: FieldGroup[]): string[] {
  return groups.flatMap((group) => group.options);
}
