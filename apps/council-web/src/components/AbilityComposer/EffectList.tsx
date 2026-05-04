import { Plus } from 'lucide-react';

import type { EffectDto } from '@dod/api-contract';

import { Button } from '@/components/Button';

import { defaultEffect } from './abilities';
import type { AbilityComposerContext } from './AbilityComposer';
import { EffectEditor } from './EffectEditor';

import styles from './AbilityComposer.module.scss';

interface Props {
  value: EffectDto[];
  context: AbilityComposerContext;
  onChange: (next: EffectDto[]) => void;
}

export function EffectList({ value, context, onChange }: Props) {
  function add() {
    onChange([...value, defaultEffect]);
  }

  function update(index: number, effect: EffectDto) {
    const next = [...value];
    next[index] = effect;
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, current) => current !== index));
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= value.length) {
      return;
    }
    const next = [...value];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  }

  return (
    <div className={styles.effects}>
      <div className={styles.effectsHeader}>
        <span className={styles.label}>Effects</span>
        <Button variant="secondary" onClick={add}>
          <span className={styles.addInner}>
            <Plus size={14} />
            Add effect
          </span>
        </Button>
      </div>
      {value.length === 0 && (
        <p className={styles.warn}>An ability needs at least one effect.</p>
      )}
      {value.map((effect, index) => (
        <EffectEditor
          key={index}
          index={index}
          effect={effect}
          context={context}
          onChange={(next) => update(index, next)}
          onRemove={() => remove(index)}
          onMoveUp={index > 0 ? () => move(index, -1) : undefined}
          onMoveDown={
            index < value.length - 1 ? () => move(index, 1) : undefined
          }
        />
      ))}
    </div>
  );
}
