import {
  ACTIVATION_VALUES,
  type CardDto,
  type ElementDto,
  type FactionDto,
  type StatDto,
  type TraitDto,
} from '@dod/api-contract';

import { AbilityComposer } from '@/components/AbilityComposer';
import {
  ExpressionEditor,
  ExpressionEditorProvider,
} from '@/components/ExpressionEditor';
import { ImageInput } from '@/components/ImageInput';
import { PillToggle } from '@/components/PillToggle';
import { Textarea } from '@/components/Textarea';

import { type CardFormPayload, useCodexCardForm } from './useCodexCardForm';

import styles from './CodexCardForm.module.scss';

export type { CardFormPayload };

interface Props {
  formId: string;
  initial?: Partial<CardDto>;
  elements: ElementDto[];
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
  cards: CardDto[];
  onSubmit: (payload: CardFormPayload) => void;
}

export function CodexCardForm({
  formId,
  initial,
  elements,
  factions,
  stats,
  traits,
  cards,
  onSubmit,
}: Props) {
  const form = useCodexCardForm({ initial, stats, traits, onSubmit });

  return (
    <ExpressionEditorProvider value={{ elements, factions, stats, traits }}>
      <form id={formId} onSubmit={form.handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Id</span>
          {form.isEditMode ? (
            <span className={styles.readonly}>{form.id}</span>
          ) : (
            <input
              value={form.id}
              onChange={(event) => form.setId(event.target.value)}
              placeholder="e.g. goblinBerserker"
              required
            />
          )}
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            value={form.name}
            onChange={(event) => form.setName(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Description</span>
          <Textarea
            value={form.description}
            onChange={(event) => form.setDescription(event.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Activation</span>
          <select
            value={form.activation}
            onChange={(event) =>
              form.setActivation(event.target.value as typeof form.activation)
            }
          >
            {ACTIVATION_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Art</span>
          <ImageInput value={form.art} onChange={form.setArt} aspect={1} />
        </div>
        {factions.length > 0 && (
          <div className={styles.field}>
            <span className={styles.label}>Factions</span>
            <div className={styles.pillRow}>
              {factions.map((faction) => (
                <PillToggle
                  key={faction.id}
                  selected={form.factionIds.has(faction.id)}
                  onToggle={() => form.toggleFaction(faction.id)}
                >
                  {faction.name}
                </PillToggle>
              ))}
            </div>
          </div>
        )}
        {elements.length > 0 && (
          <div className={styles.field}>
            <span className={styles.label}>Cost</span>
            <div className={styles.numberGrid}>
              {elements.map((element) => (
                <label key={element.id} className={styles.numberRow}>
                  <span className={styles.numberLabel}>{element.name}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.cost[element.id] ?? 0}
                    onFocus={(event) => event.currentTarget.select()}
                    onWheel={(event) => event.currentTarget.blur()}
                    onChange={(event) =>
                      form.updateCost(element.id, Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        )}
        {form.activation === 'emptySlot' && form.minionStats.length > 0 && (
          <div className={styles.field}>
            <span className={styles.label}>Stats</span>
            <div className={styles.expressionGrid}>
              {form.minionStats.map((stat) => (
                <div key={stat.id} className={styles.expressionRow}>
                  <span className={styles.numberLabel}>{stat.name}</span>
                  <ExpressionEditor
                    value={form.statValues[stat.id] ?? 0}
                    onChange={(next) => form.updateStat(stat.id, next)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {form.filteredTraits.length > 0 && (
          <div className={styles.field}>
            <span className={styles.label}>Traits</span>
            <div className={styles.pillRow}>
              {form.filteredTraits.map((trait) => (
                <PillToggle
                  key={trait.id}
                  selected={form.traitIds.has(trait.id)}
                  onToggle={() => form.toggleTrait(trait.id)}
                >
                  {trait.name}
                </PillToggle>
              ))}
            </div>
          </div>
        )}
        <div className={styles.field}>
          <span className={styles.label}>Abilities</span>
          <AbilityComposer
            value={form.abilities}
            onChange={form.setAbilities}
            context={{ elements, factions, stats, traits, cards }}
          />
        </div>
      </form>
    </ExpressionEditorProvider>
  );
}
