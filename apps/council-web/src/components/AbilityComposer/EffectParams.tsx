import { Trash2 } from 'lucide-react';

import type { EffectDto, Expression } from '@dod/api-contract';

import { ExpressionEditor } from '@/components/ExpressionEditor';
import { IconButton } from '@/components/IconButton';
import { PillToggle } from '@/components/PillToggle';

import type { AbilityComposerContext } from './AbilityComposer';

import styles from './AbilityComposer.module.scss';

interface Props {
  effect: EffectDto;
  context: AbilityComposerContext;
  onChange: (next: EffectDto) => void;
}

export function EffectParams({ effect, context, onChange }: Props) {
  switch (effect.kind) {
    case 'damage':
    case 'heal':
      return (
        <ExpressionField
          label="Amount"
          value={effect.params.amount}
          onChange={(amount) => onChange({ ...effect, params: { amount } })}
        />
      );
    case 'fullHeal':
    case 'destroy':
    case 'attackNow':
    case 'preventDamage':
    case 'reflectDamage':
      return null;
    case 'gainElement':
      return (
        <SlugRecordField
          label="Per element"
          options={context.elements}
          value={effect.params}
          onChange={(params) => onChange({ ...effect, params })}
        />
      );
    case 'increaseStat':
    case 'decreaseStat':
    case 'multiplyStat':
    case 'setStat':
      return (
        <SlugRecordField
          label="Per stat"
          options={context.stats}
          value={effect.params}
          onChange={(params) => onChange({ ...effect, params })}
        />
      );
    case 'giveTraits': {
      const params = effect.params;
      return (
        <>
          <TraitListField
            label="Traits"
            options={context.traits}
            value={params.traits}
            onChange={(traits) =>
              onChange({ ...effect, params: { ...params, traits } })
            }
          />
          <label className={styles.field}>
            <span className={styles.label}>Duration (turns)</span>
            <input
              type="number"
              min={0}
              value={params.duration ?? 0}
              onFocus={(event) => event.currentTarget.select()}
              onWheel={(event) => event.currentTarget.blur()}
              onChange={(event) => {
                const value = Number(event.target.value);
                const next = { traits: params.traits } as typeof params;
                if (value > 0) {
                  next.duration = value;
                }
                onChange({ ...effect, params: next });
              }}
            />
          </label>
        </>
      );
    }
    case 'removeTraits':
      return (
        <TraitListField
          label="Traits"
          options={context.traits}
          value={effect.params.traits}
          onChange={(traits) => onChange({ ...effect, params: { traits } })}
        />
      );
    case 'summon':
      return (
        <label className={styles.field}>
          <span className={styles.label}>Minion (card id)</span>
          <select
            value={effect.params.minion}
            onChange={(event) =>
              onChange({
                ...effect,
                params: { minion: event.target.value },
              })
            }
          >
            <option value="">— pick a card —</option>
            {context.cards
              .filter((card) => card.activation === 'emptySlot')
              .map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
          </select>
        </label>
      );
  }
}

interface ExpressionFieldProps {
  label: string;
  value: Expression;
  onChange: (next: Expression) => void;
}

function ExpressionField({ label, value, onChange }: ExpressionFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <ExpressionEditor value={value} onChange={onChange} />
    </div>
  );
}

interface SlugRecordFieldProps {
  label: string;
  options: { id: string; name: string }[];
  value: Record<string, Expression>;
  onChange: (next: Record<string, Expression>) => void;
}

function SlugRecordField({
  label,
  options,
  value,
  onChange,
}: SlugRecordFieldProps) {
  function remove(slug: string) {
    const next = { ...value };
    delete next[slug];
    onChange(next);
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.slugRecord}>
        {options.map((option) => {
          const present = Object.prototype.hasOwnProperty.call(
            value,
            option.id,
          );
          return (
            <div key={option.id} className={styles.slugRow}>
              <div className={styles.slugLabelRow}>
                <span className={styles.slugLabel}>{option.name}</span>
                {present && (
                  <IconButton onClick={() => remove(option.id)}>
                    <Trash2 size={14} />
                  </IconButton>
                )}
              </div>
              <ExpressionEditor
                value={value[option.id] ?? 0}
                onChange={(next) => onChange({ ...value, [option.id]: next })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TraitListFieldProps {
  label: string;
  options: { id: string; name: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}

function TraitListField({
  label,
  options,
  value,
  onChange,
}: TraitListFieldProps) {
  function toggle(id: string) {
    onChange(
      value.includes(id)
        ? value.filter((entry) => entry !== id)
        : [...value, id],
    );
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.pillRow}>
        {options.map((option) => (
          <PillToggle
            key={option.id}
            selected={value.includes(option.id)}
            onToggle={() => toggle(option.id)}
          >
            {option.name}
          </PillToggle>
        ))}
      </div>
    </div>
  );
}
