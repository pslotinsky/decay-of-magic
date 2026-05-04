import {
  Atom,
  Ruler,
  ScrollText,
  Shield,
  Sparkles,
  UserSquare2,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { NavLink } from 'react-router';

import { useUniverse } from '../../api/universe';
import { navLinkClass, NavMenu } from './NavMenu';

import styles from './NavMenu.module.scss';

interface Props {
  universeId: string;
}

interface CodexSection {
  slug: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

const codexSections: CodexSection[] = [
  { slug: 'card', label: 'Cards', icon: ScrollText },
  { slug: 'element', label: 'Elements', icon: Atom },
  { slug: 'faction', label: 'Factions', icon: Shield },
  { slug: 'stat', label: 'Stats', icon: Ruler },
  { slug: 'trait', label: 'Traits', icon: Sparkles },
  { slug: 'hero', label: 'Heroes', icon: UserSquare2 },
];

export function UniverseNav({ universeId }: Props) {
  const { data: universe } = useUniverse(universeId);

  return (
    <NavMenu>
      <ul className={styles.links}>
        <li className={styles.universeName}>
          <NavLink to={`/universe/${universeId}`} end className={navLinkClass}>
            {universe?.name ?? '…'}
          </NavLink>
        </li>
        {codexSections.map(({ slug, label, icon: Icon }) => (
          <li key={slug}>
            <NavLink
              to={`/universe/${universeId}/codex/${slug}`}
              className={navLinkClass}
            >
              <Icon />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </NavMenu>
  );
}
