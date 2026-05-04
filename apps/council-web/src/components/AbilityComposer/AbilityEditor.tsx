import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

import {
  type AbilityDto,
  type EffectDto,
  type Expression,
  type Target,
  TARGET_VALUES,
  type Targets,
  type Trigger,
  TRIGGER_VALUES,
} from '@dod/api-contract';

import { ExpressionEditor } from '@/components/ExpressionEditor';
import { IconButton } from '@/components/IconButton';
import { PillToggle } from '@/components/PillToggle';

import { buildPassive, buildTriggered, isPassive } from './abilities';
import type { AbilityComposerContext } from './AbilityComposer';
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

  function toggleTarget(value: Target) {
    const current = Array.isArray(target) ? target : [target];
    const exists = current.includes(value);
    const nextList = exists
      ? current.filter((entry) => entry !== value)
      : [...current, value];
    if (nextList.length === 0) {
      return;
    }
    const nextTarget: Targets = nextList.length === 1 ? nextList[0]! : nextList;
    onChange(rebuild({ target: nextTarget }));
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
                onToggle={() => toggleTarget(value)}
              >
                {value}
              </PillToggle>
            );
          })}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={exclude !== undefined}
            onChange={toggleExclude}
          />
          Exclude expression
        </label>
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
