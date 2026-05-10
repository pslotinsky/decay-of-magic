import { Plus, Trash2 } from 'lucide-react';

import type { Expression } from '@dod/api-contract';

import { IconButton } from '@/components/IconButton';

import { CollectionPicker } from './CollectionPicker';
import { useExpressionEditorContext } from './context';
import { ExpressionEditor } from './ExpressionEditor';
import {
  type AnyOp,
  arity,
  BINARY_OPERATORS,
  buildOperator,
  defaultForKind,
  defaultOperands,
  detectListKind,
  detectOperator,
  type ListKind,
  type OperandSpec,
  operandSpec,
  operatorOperands,
  TERNARY_OPERATORS,
  UNARY_OPERATORS,
  VARIADIC_OPERATORS,
} from './expressions';
import { StatPicker } from './StatPicker';

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
    const defaults = defaultOperands(next);
    let count: number;
    if (nextArity === 'unary') {
      count = 1;
    } else if (nextArity === 'binary') {
      count = 2;
    } else if (nextArity === 'ternary') {
      count = 3;
    } else {
      count = Math.max(operands.length, 2);
    }

    const nextOperands: Expression[] = [];
    for (let index = 0; index < count; index += 1) {
      const oldKind = operandSpec(op, index).kind;
      const newKind = operandSpec(next, index).kind;
      const previous = operands[index];
      if (oldKind === newKind && previous !== undefined) {
        nextOperands.push(previous);
      } else {
        nextOperands.push(defaults[index] ?? defaultForKind(newKind));
      }
    }

    onChange(buildOperator(next, nextOperands));
  }

  function updateOperand(index: number, expression: Expression) {
    const next = [...operands];
    next[index] = expression;
    onChange(buildOperator(op, next));
  }

  function addOperand() {
    const spec = operandSpec(op, operands.length);
    onChange(buildOperator(op, [...operands, defaultForKind(spec.kind)]));
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
        <optgroup label="ternary">
          {TERNARY_OPERATORS.map((entry) => (
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
          const spec = operandSpec(op, index);
          const showItemPicker = containsListKind !== null && index === 1;
          return (
            <div key={index} className={styles.operandRow}>
              <div className={styles.operandEditor}>
                <span className={styles.operandLabel}>{spec.label}</span>
                {showItemPicker ? (
                  <ListItemPicker
                    kind={containsListKind!}
                    value={operand}
                    onChange={(expression) => updateOperand(index, expression)}
                  />
                ) : (
                  <SlotEditor
                    spec={spec}
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

interface SlotEditorProps {
  spec: OperandSpec;
  value: Expression;
  onChange: (next: Expression) => void;
}

function SlotEditor({ spec, value, onChange }: SlotEditorProps) {
  switch (spec.kind) {
    case 'collection':
      return <CollectionPicker value={value} onChange={onChange} />;
    case 'statSlug':
      return <StatPicker value={value} onChange={onChange} />;
    case 'number':
      return <NumberSlot value={value} onChange={onChange} />;
    case 'expression':
      return <ExpressionEditor value={value} onChange={onChange} />;
  }
}

interface NumberSlotProps {
  value: Expression;
  onChange: (next: Expression) => void;
}

function NumberSlot({ value, onChange }: NumberSlotProps) {
  const numeric = typeof value === 'number' ? value : 0;
  return (
    <input
      type="number"
      step="any"
      value={numeric}
      onFocus={(event) => event.currentTarget.select()}
      onWheel={(event) => event.currentTarget.blur()}
      onChange={(event) => {
        const raw = event.target.value;
        onChange(raw === '' ? 0 : Number(raw));
      }}
    />
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
