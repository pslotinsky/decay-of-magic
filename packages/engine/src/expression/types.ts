export type ExpressionDefinition =
  | string
  | number
  | boolean
  | { not: ExpressionDefinition }
  | { ceil: ExpressionDefinition }
  | { count: ExpressionDefinition }
  | { and: ExpressionDefinition[] }
  | { or: ExpressionDefinition[] }
  | { eq: [ExpressionDefinition, ExpressionDefinition] }
  | { ne: [ExpressionDefinition, ExpressionDefinition] }
  | { lt: [ExpressionDefinition, ExpressionDefinition] }
  | { lte: [ExpressionDefinition, ExpressionDefinition] }
  | { gt: [ExpressionDefinition, ExpressionDefinition] }
  | { gte: [ExpressionDefinition, ExpressionDefinition] }
  | { add: ExpressionDefinition[] }
  | { sub: [ExpressionDefinition, ExpressionDefinition] }
  | { mul: ExpressionDefinition[] }
  | { div: [ExpressionDefinition, ExpressionDefinition] }
  | { min: ExpressionDefinition[] }
  | { max: ExpressionDefinition[] }
  | { contains: [ExpressionDefinition, ExpressionDefinition] }
  | { maxBy: [ExpressionDefinition, ExpressionDefinition] }
  | { rankBy: [ExpressionDefinition, ExpressionDefinition] }
  | {
      sumTopBy: [
        ExpressionDefinition,
        ExpressionDefinition,
        ExpressionDefinition,
      ];
    };

export type Entity = { stats: Record<string, number> };
export type Value = number | boolean | string | Entity | Entity[] | string[];
