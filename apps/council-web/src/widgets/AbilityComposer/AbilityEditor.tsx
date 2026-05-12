import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

import {
  type AbilityDto,
  type EffectDto,
  type Expression,
  TARGET_VALUES,
  type Target,
  type Targets,
  TRIGGER_VALUES,
  type Trigger,
} from '@dod/api-contract';

import { Checkbox } from '@/components/Checkbox';
import { IconButton } from '@/components/IconButton';
import { PillToggle } from '@/components/PillToggle';
import { ExpressionEditor } from '@/widgets/ExpressionEditor';

import type { AbilityComposerContext } from './AbilityComposer';
import { buildPassive, buildTriggered, isPassive } from './abilities';
import { EffectList } from './EffectList';

import styles from './AbilityComposer.module.scss';

interface Props {
  ability: AbilityDto;
  context: AbilityComposerContext;
  onChange: (next: AbilityDto) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function AbilityEditor({
  ability,
  context,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const passive = isPassive(ability);
  const target = ability.target;
  const effects = ability.effects;
  const exclude = ability.exclude;

  function rebuild(
    overrides: Partial<{
      target: Targets;
      effects: EffectDto[];
      exclude?: Expression;
    }>,
  ): AbilityDto {
    const nextTarget = overrides.target ?? target;
    const nextEffects = overrides.effects ?? effects;
    const nextExclude = 'exclude' in overrides ? overrides.exclude : exclude;
    if (passive) {
      return buildPassive(nextTarget, nextEffects, nextExclude);
    }
    return buildTriggered(
      ability.trigger,
      nextTarget,
      nextEffects,
      nextExclude,
    );
  }

  function setMode(nextPassive: boolean) {
    if (nextPassive === passive) {
      return;
    }
    if (nextPassive) {
      onChange(buildPassive(target, effects, exclude));
    } else {
      onChange(buildTriggered('onPlay', target, effects, exclude));
    }
  }

  function setTrigger(trigger: Trigger) {
    if (passive) {
      return;
    }
    onChange(buildTriggered(trigger, target, effects, exclude));
  }

  function setTarget(value: Target) {
    onChange(rebuild({ target: value }));
  }

  function toggleTarget(value: Target) {
    const current = Array.isArray(target) ? target : [target];

    const next = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : current.concat(value);

    if (next.length > 0) {
      onChange(rebuild({ target: next.length === 1 ? next[0]! : next }));
    }
  }

  function toggleExclude() {
    onChange(rebuild({ exclude: exclude === undefined ? 'self' : undefined }));
  }

  function setExclude(next: Expression) {
    onChange(rebuild({ exclude: next }));
  }

  return (
    <div className={styles.ability}>
      <div className={styles.abilityHeader}>
        <div className={styles.modeToggle}>
          <label className={styles.radio}>
            <input
              type="radio"
              checked={!passive}
              onChange={() => setMode(false)}
            />
            Trigger
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              checked={passive}
              onChange={() => setMode(true)}
            />
            Passive
          </label>
        </div>
        <div className={styles.abilityActions}>
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

      {!passive && (
        <label className={styles.field}>
          <span className={styles.label}>Trigger</span>
          <select
            value={ability.trigger}
            onChange={(event) => setTrigger(event.target.value as Trigger)}
          >
            {TRIGGER_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className={styles.field}>
        <span className={styles.label}>Target</span>
        <div className={styles.pillRow}>
          {TARGET_VALUES.map((value) => {
            const selected = Array.isArray(target)
              ? target.includes(value)
              : target === value;
            return (
              <PillToggle
                key={value}
                selected={selected}
                onToggle={(event) =>
                  event.shiftKey ? toggleTarget(value) : setTarget(value)
                }
              >
                {value}
              </PillToggle>
            );
          })}
        </div>
        <span className={styles.hint}>Shift+click to combine targets</span>
      </div>

      <div className={styles.field}>
        <Checkbox checked={exclude !== undefined} onChange={toggleExclude}>
          Exclude expression
        </Checkbox>
        {exclude !== undefined && (
          <ExpressionEditor value={exclude} onChange={setExclude} />
        )}
      </div>

      <EffectList
        value={effects}
        context={context}
        onChange={(next) => onChange(rebuild({ effects: next }))}
      />
    </div>
  );
}
