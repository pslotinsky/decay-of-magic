import { Image as ImageIcon, Pencil } from 'lucide-react';

import type {
  AbilityDto,
  CardDto,
  EffectDto,
  Expression,
} from '@dod/api-contract';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';

import styles from './CodexCardItem.module.scss';

interface Props {
  card: CardDto;
  onEdit: (card: CardDto) => void;
}

export function CodexCardItem({ card, onEdit }: Props) {
  const cost =
    card.cost && Object.keys(card.cost).length > 0 ? card.cost : null;
  const stats =
    card.stats && Object.keys(card.stats).length > 0 ? card.stats : null;
  const showAbilitiesOrTraits = Boolean(
    card.abilities?.length || card.traits?.length,
  );

  return (
    <Card interactive className={styles.cardItem} onClick={() => onEdit(card)}>
      {card.art ? (
        <img className={styles.art} src={card.art} alt={card.name} />
      ) : (
        <div className={styles.artPlaceholder}>
          <ImageIcon size={40} />
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <div className={styles.name}>{card.name}</div>
          <IconButton
            className={styles.edit}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(card);
            }}
          >
            <Pencil size={16} />
          </IconButton>
        </div>
        {cost && (
          <div className={styles.chipRow}>
            {Object.entries(cost).map(([slug, value]) => (
              <span key={slug} className={`${styles.chip} ${styles.chipCost}`}>
                <span className={styles.chipKey}>{slug}</span>
                <span className={styles.chipValue}>{value}</span>
              </span>
            ))}
          </div>
        )}
        {stats && (
          <div className={styles.chipRow}>
            {Object.entries(stats).map(([slug, expr]) => (
              <span key={slug} className={`${styles.chip} ${styles.chipStat}`}>
                <span className={styles.chipKey}>{slug}</span>
                <span className={styles.chipValue}>
                  {formatExpression(expr)}
                </span>
              </span>
            ))}
          </div>
        )}
        {showAbilitiesOrTraits && (
          <div className={styles.chipRow}>
            {card.abilities?.map((ability, index) => (
              <span
                key={`ability-${index}`}
                className={`${styles.chip} ${styles.chipAbility}`}
                title={describeAbility(ability)}
              >
                {abilityShortcut(ability)}
              </span>
            ))}
            {card.traits?.map((slug) => (
              <span
                key={`trait-${slug}`}
                className={`${styles.chip} ${styles.chipTrait}`}
              >
                {slug}
              </span>
            ))}
          </div>
        )}
        {card.description && (
          <p className={styles.description}>{card.description}</p>
        )}
      </div>
    </Card>
  );
}

function formatExpression(expr: Expression): string {
  if (
    typeof expr === 'number' ||
    typeof expr === 'boolean' ||
    typeof expr === 'string'
  ) {
    return String(expr);
  }
  return 'expr';
}

function abilityShortcut(ability: AbilityDto): string {
  return 'passive' in ability ? 'passive' : ability.trigger;
}

function describeAbility(ability: AbilityDto): string {
  const targetText = Array.isArray(ability.target)
    ? ability.target.join(' + ')
    : ability.target;
  const head =
    'passive' in ability
      ? `passive → ${targetText}`
      : `${ability.trigger} → ${targetText}`;
  const lines = ability.effects.map((effect) => `• ${describeEffect(effect)}`);
  return [head, ...lines].join('\n');
}

function describeEffect(effect: EffectDto): string {
  const params = effect.params as Record<string, unknown>;
  const entries = Object.entries(params ?? {});
  if (entries.length === 0) return effect.kind;
  const parts = entries.map(([key, value]) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return `${key}=${value}`;
    }
    if (Array.isArray(value)) {
      return `${key}=[${value.join(',')}]`;
    }
    return `${key}=expr`;
  });
  return `${effect.kind}(${parts.join(', ')})`;
}
