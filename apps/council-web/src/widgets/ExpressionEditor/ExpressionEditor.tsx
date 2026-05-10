import { AtSign, Braces, Hash, ToggleLeft, Type } from 'lucide-react';
import { useState } from 'react';

import type { Expression } from '@dod/api-contract';

import {
  ButtonSelect,
  type ButtonSelectOption,
} from '@/components/ButtonSelect';
import { Checkbox } from '@/components/Checkbox';

import { defaultForMode, detectMode, type Mode } from './expressions';
import { OperatorBody } from './OperatorBody';
import { PathBody } from './PathBody';

import styles from './ExpressionEditor.module.scss';

const ICON_SIZE = 14;

const MODE_OPTIONS: ButtonSelectOption<Mode>[] = [
  {
    value: 'number',
    description: 'number',
    icon: <Hash size={ICON_SIZE} />,
  },
  {
    value: 'boolean',
    description: 'boolean',
    icon: <ToggleLeft size={ICON_SIZE} />,
  },
  {
    value: 'literalString',
    description: 'text',
    icon: <Type size={ICON_SIZE} />,
  },
  {
    value: 'path',
    description: 'path',
    icon: <AtSign size={ICON_SIZE} />,
  },
  {
    value: 'operator',
    description: 'operator',
    icon: <Braces size={ICON_SIZE} />,
  },
];

interface Props {
  value?: Expression;
  onChange: (next: Expression) => void;
  onClear?: () => void;
}

export function ExpressionEditor({ value, onChange, onClear }: Props) {
  const detected = value === undefined ? 'number' : detectMode(value);
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
        <ModeBody
          mode={mode}
          value={value}
          onChange={onChange}
          onClear={onClear}
        />
        <ButtonSelect
          value={mode}
          onChange={changeMode}
          options={MODE_OPTIONS}
          ariaLabel="value type"
          className={styles.kindSelect}
        />
      </div>
    </div>
  );
}

interface BodyProps {
  mode: Mode;
  value: Expression | undefined;
  onChange: (next: Expression) => void;
  onClear?: () => void;
}

function ModeBody({ mode, value, onChange, onClear }: BodyProps) {
  if (mode === 'number') {
    const numeric = typeof value === 'number' ? value : undefined;
    return (
      <input
        type="number"
        step="any"
        value={numeric ?? ''}
        onFocus={(event) => event.currentTarget.select()}
        onWheel={(event) => event.currentTarget.blur()}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw !== '') {
            onChange(Number(raw));
          } else if (onClear) {
            onClear();
          } else {
            onChange(0);
          }
        }}
      />
    );
  }
  if (mode === 'boolean') {
    const bool = typeof value === 'boolean' ? value : false;
    return (
      <Checkbox checked={bool} onChange={onChange}>
        {bool ? 'true' : 'false'}
      </Checkbox>
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
    return <PathBody value={value ?? 'self'} onChange={onChange} />;
  }
  if (mode === 'operator') {
    return (
      <OperatorBody
        value={value ?? defaultForMode('operator')}
        onChange={onChange}
      />
    );
  }
  return null;
}
