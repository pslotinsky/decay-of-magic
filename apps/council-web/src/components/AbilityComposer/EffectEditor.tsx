import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

import {
  EFFECT_KIND_VALUES,
  type EffectDto,
  type EffectKind,
  type Expression,
} from '@dod/api-contract';

import { ExpressionEditor } from '@/components/ExpressionEditor';
import { IconButton } from '@/components/IconButton';

import { emptyEffect } from './abilities';
import type { AbilityComposerContext } from './AbilityComposer';
import { EffectParams } from './EffectParams';

import styles from './AbilityComposer.module.scss';

interface Props {
  index: number;
  effect: EffectDto;
  context: AbilityComposerContext;
  onChange: (next: EffectDto) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function EffectEditor({
  index,
  effect,
  context,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  function setKind(kind: EffectKind) {
    if (kind === effect.kind) {
      return;
    }
    onChange({ ...emptyEffect(kind), filter: effect.filter });
  }

  function toggleFilter() {
    if (effect.filter !== undefined) {
      const next = { ...effect };
      delete next.filter;
      onChange(next);
    } else {
      onChange({ ...effect, filter: 'self' });
    }
  }

  function setFilter(next: Expression) {
    onChange({ ...effect, filter: next });
  }

  return (
    <div className={styles.effect}>
      <div className={styles.effectHeader}>
        <span className={styles.effectIndex}>{index + 1}.</span>
        <select
          value={effect.kind}
          onChange={(event) => setKind(event.target.value as EffectKind)}
        >
          {EFFECT_KIND_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <div className={styles.effectActions}>
          {onMoveUp && (
            <IconButton onClick={onMoveUp}>
              <ArrowUp size={14} />
            </IconButton>
          )}
          {onMoveDown && (
            <IconButton onClick={onMoveDown}>
              <ArrowDown size={14} />
            </IconButton>
          )}
          <IconButton onClick={onRemove}>
            <Trash2 size={14} />
          </IconButton>
        </div>
      </div>
      <EffectParams effect={effect} context={context} onChange={onChange} />
      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={effect.filter !== undefined}
          onChange={toggleFilter}
        />
        Per-effect filter
      </label>
      {effect.filter !== undefined && (
        <ExpressionEditor value={effect.filter} onChange={setFilter} />
      )}
    </div>
  );
}
