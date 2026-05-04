import {
  Atom,
  Ruler,
  ScrollText,
  Shield,
  Sparkles,
  UserSquare2,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useUniverse } from '@/api/universe';
import { Card } from '@/components/Card';
import { ErrorText } from '@/components/ErrorText';
import { UniverseNav } from '@/components/NavMenu';
import { Page } from '@/components/Page';

import { UniversePageHeader } from './UniversePageHeader';

import styles from './UniversePage.module.scss';

interface Section {
  slug: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
}

const sections: Section[] = [
  {
    slug: 'card',
    title: 'Cards',
    description: 'Spells and summon-style cards',
    icon: ScrollText,
  },
  {
    slug: 'element',
    title: 'Elements',
    description: 'Resources spent to play cards',
    icon: Atom,
  },
  {
    slug: 'faction',
    title: 'Factions',
    description: 'Card and hero groupings',
    icon: Shield,
  },
  {
    slug: 'stat',
    title: 'Stats',
    description: 'Numeric attributes per archetype',
    icon: Ruler,
  },
  {
    slug: 'trait',
    title: 'Traits',
    description: 'Tags that abilities react to',
    icon: Sparkles,
  },
  {
    slug: 'hero',
    title: 'Heroes',
    description: 'Player avatars with starting elements',
    icon: UserSquare2,
  },
];

export function UniversePage() {
  const { id } = useParams<{ id: string }>();
  const { data: universe, isLoading, error } = useUniverse(id!);
  const navigate = useNavigate();

  return (
    <Page
      nav={<UniverseNav universeId={id!} />}
      header={universe && <UniversePageHeader universe={universe} />}
    >
      <ErrorText message={error?.message} />
      {isLoading && !universe && null}
      {universe && (
        <div className={styles.grid}>
          {sections.map(({ slug, title, description, icon: Icon }) => (
            <Card
              key={slug}
              interactive
              className={styles.card}
              onClick={() =>
                void navigate(`/universe/${universe.id}/codex/${slug}`)
              }
            >
              <div className={styles.iconBox}>
                <Icon size={32} />
              </div>
              <div className={styles.body}>
                <div className={styles.title}>{title}</div>
                <p className={styles.description}>{description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
