import { Plus, Trash2 } from 'lucide-react';

import type { Expression } from '@dod/api-contract';

import { IconButton } from '@/components/IconButton';

import { useExpressionEditorContext } from './context';
import { ExpressionEditor } from './ExpressionEditor';
import {
  type AnyOp,
  arity,
  BINARY_OPERATORS,
  buildOperator,
  defaultOperands,
  detectListKind,
  detectOperator,
  type ListKind,
  operatorOperands,
  UNARY_OPERATORS,
  VARIADIC_OPERATORS,
} from './expressions';

import styles from './ExpressionEditor.module.scss';

interface Props {
  value: Expression;
  onChange: (next: Expression) => void;
}

export function OperatorBody({ value, onChange }: Props) {
  const op = detectOperator(value) ?? 'eq';
  const operands = operatorOperands(value, op);
  const opArity = arity(op);

  const containsListKind: ListKind | null =
    op === 'contains' ? detectListKind(operands[0]) : null;

  function setOperator(next: AnyOp) {
    if (next === op) {
      return;
    }
    const nextArity = arity(next);
    let nextOperands: Expression[];
    if (nextArity === 'unary') {
      nextOperands = [operands[0] ?? 0];
    } else if (nextArity === 'binary') {
      nextOperands = [operands[0] ?? 0, operands[1] ?? 0];
    } else {
      nextOperands = operands.length >= 2 ? operands : defaultOperands(next);
    }
    onChange(buildOperator(next, nextOperands));
  }

  function updateOperand(index: number, expression: Expression) {
    const next = [...operands];
    next[index] = expression;
    onChange(buildOperator(op, next));
  }

  function addOperand() {
    onChange(buildOperator(op, [...operands, 0]));
  }

  function removeOperand(index: number) {
    if (operands.length <= 2) {
      return;
    }
    onChange(
      buildOperator(
        op,
        operands.filter((_, current) => current !== index),
      ),
    );
  }

  return (
    <div className={styles.operatorBody}>
      <select
        value={op}
        onChange={(event) => setOperator(event.target.value as AnyOp)}
        className={styles.operatorSelect}
      >
        <optgroup label="comparison">
          {BINARY_OPERATORS.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </optgroup>
        <optgroup label="variadic">
          {VARIADIC_OPERATORS.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </optgroup>
        <optgroup label="unary">
          {UNARY_OPERATORS.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </optgroup>
      </select>

      <div className={styles.operands}>
        {operands.map((operand, index) => {
          const showItemPicker = containsListKind !== null && index === 1;
          return (
            <div key={index} className={styles.operandRow}>
              <div className={styles.operandEditor}>
                {showItemPicker ? (
                  <ListItemPicker
                    kind={containsListKind!}
                    value={operand}
                    onChange={(expression) => updateOperand(index, expression)}
                  />
                ) : (
                  <ExpressionEditor
                    value={operand}
                    onChange={(expression) => updateOperand(index, expression)}
                  />
                )}
              </div>
              {opArity === 'variadic' && operands.length > 2 && (
                <IconButton onClick={() => removeOperand(index)}>
                  <Trash2 size={14} />
                </IconButton>
              )}
            </div>
          );
        })}
        {opArity === 'variadic' && (
          <button
            type="button"
            className={styles.addOperand}
            onClick={addOperand}
          >
            <Plus size={14} /> operand
          </button>
        )}
      </div>
    </div>
  );
}

interface ListItemPickerProps {
  kind: ListKind;
  value: Expression;
  onChange: (next: Expression) => void;
}

function ListItemPicker({ kind, value, onChange }: ListItemPickerProps) {
  const ctx = useExpressionEditorContext();
  const options =
    ctx === null ? [] : kind === 'trait' ? ctx.traits : ctx.factions;
  const stringValue = typeof value === 'string' ? value : '';

  if (ctx === null) {
    return (
      <input
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`${kind} id`}
      />
    );
  }

  return (
    <select
      value={stringValue}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">— pick {kind} —</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
