import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import rostraImg from '../../assets/rostra.webp';
import { useAuth } from '../../context/useAuth';

import styles from './NavMenu.module.scss';

interface Props {
  children: ReactNode;
}

export function NavMenu({ children }: Props) {
  const { citizen, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <img src={rostraImg} alt="Rostra" />
        <span className={styles.logoName}>The Council</span>
      </Link>
      <div className={styles.inner}>
        {children}
        <span className={styles.citizen}>{citizen?.nickname}</span>
        <button className={styles.logout} onClick={() => void logout()}>
          <LogOut />
          Dismiss
        </button>
      </div>
    </nav>
  );
}

export function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? styles.active : undefined;
}
