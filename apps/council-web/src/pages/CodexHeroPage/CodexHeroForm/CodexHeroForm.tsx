import type {
  CardDto,
  ElementDto,
  FactionDto,
  HeroDto,
  StatDto,
  TraitDto,
} from '@dod/api-contract';

import { AbilityComposer } from '@/components/AbilityComposer';
import {
  ExpressionEditor,
  ExpressionEditorProvider,
} from '@/components/ExpressionEditor';
import { ImageInput } from '@/components/ImageInput';
import { PillToggle } from '@/components/PillToggle';
import { Textarea } from '@/components/Textarea';

import { type HeroFormPayload, useCodexHeroForm } from './useCodexHeroForm';

import styles from './CodexHeroForm.module.scss';

export type { HeroFormPayload };

interface Props {
  formId: string;
  initial?: HeroDto;
  elements: ElementDto[];
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
  cards: CardDto[];
  onSubmit: (payload: HeroFormPayload) => void;
}

export function CodexHeroForm({
  formId,
  initial,
  elements,
  factions,
  stats,
  traits,
  cards,
  onSubmit,
}: Props) {
  const form = useCodexHeroForm({ initial, elements, stats, traits, onSubmit });

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
              placeholder="e.g. archmage"
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
          <span className={styles.label}>Faction</span>
          <select
            value={form.faction}
            onChange={(event) => form.setFaction(event.target.value)}
          >
            <option value="">none</option>
            {factions.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Art</span>
          <ImageInput value={form.art} onChange={form.setArt} />
        </div>
        {elements.length > 0 && (
          <div className={styles.field}>
            <span className={styles.label}>Starting elements</span>
            <div className={styles.numberGrid}>
              {elements.map((element) => (
                <label key={element.id} className={styles.numberRow}>
                  <span className={styles.numberLabel}>{element.name}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.elementValues[element.id] ?? 0}
                    onFocus={(event) => event.currentTarget.select()}
                    onWheel={(event) => event.currentTarget.blur()}
                    onChange={(event) =>
                      form.updateElement(element.id, Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        )}
        {form.heroStats.length > 0 && (
          <div className={styles.field}>
            <span className={styles.label}>Stats</span>
            <div className={styles.expressionGrid}>
              {form.heroStats.map((stat) => (
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
        {form.heroTraits.length > 0 && (
          <div className={styles.field}>
            <span className={styles.label}>Traits</span>
            <div className={styles.pillRow}>
              {form.heroTraits.map((trait) => (
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
