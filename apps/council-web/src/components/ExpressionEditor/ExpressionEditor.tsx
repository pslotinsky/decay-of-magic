import { useState } from 'react';

import type { Expression } from '@dod/api-contract';

import { defaultForMode, detectMode, type Mode } from './expressions';
import { OperatorBody } from './OperatorBody';
import { PathBody } from './PathBody';

import styles from './ExpressionEditor.module.scss';

interface Props {
  value: Expression;
  onChange: (next: Expression) => void;
}

export function ExpressionEditor({ value, onChange }: Props) {
  const detected = detectMode(value);
  const [overrideMode, setOverrideMode] = useState<Mode | null>(null);
  const mode = overrideMode ?? detected;

  function changeMode(next: Mode) {
    if (next === mode) {
      return;
    }
    setOverrideMode(next);
    onChange(defaultForMode(next));
  }

  return (
    <div className={styles.editor}>
      <div className={styles.kindRow}>
        <select
          value={mode}
          onChange={(event) => changeMode(event.target.value as Mode)}
          className={styles.kindSelect}
        >
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="literalString">text</option>
          <option value="path">path</option>
          <option value="operator">operator</option>
        </select>
        <ModeBody mode={mode} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

interface BodyProps {
  mode: Mode;
  value: Expression;
  onChange: (next: Expression) => void;
}

function ModeBody({ mode, value, onChange }: BodyProps) {
  if (mode === 'number') {
    const numeric = typeof value === 'number' ? value : 0;
    return (
      <input
        type="number"
        step="any"
        value={numeric}
        onFocus={(event) => event.currentTarget.select()}
        onWheel={(event) => event.currentTarget.blur()}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    );
  }
  if (mode === 'boolean') {
    const bool = typeof value === 'boolean' ? value : false;
    return (
      <label className={styles.booleanLabel}>
        <input
          type="checkbox"
          checked={bool}
          onChange={(event) => onChange(event.target.checked)}
        />
        {bool ? 'true' : 'false'}
      </label>
    );
  }
  if (mode === 'literalString') {
    const str = typeof value === 'string' ? value : '';
    return (
      <input
        value={str}
        onChange={(event) => onChange(event.target.value)}
        placeholder="literal text"
      />
    );
  }
  if (mode === 'path') {
    return <PathBody value={value} onChange={onChange} />;
  }
  if (mode === 'operator') {
    return <OperatorBody value={value} onChange={onChange} />;
  }
  return null;
}
