import { Globe, LogOut, Scroll, Sparkles, Users } from 'lucide-react';
import { Link, NavLink } from 'react-router';

import rostraImg from '../../assets/rostra.webp';
import { useAuth } from '../../context/useAuth';

import styles from './NavMenu.module.scss';

export function NavMenu() {
  const { citizen, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <img src={rostraImg} alt="Rostra" />
        <span className={styles.logoName}>The Council</span>
      </Link>
      <div className={styles.inner}>
        <ul className={styles.links}>
          <li>
            <NavLink
              to="/universe"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <Globe />
              Universes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/citizen"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <Users />
              Register of Citizens
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/card"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <Scroll />
              Cards
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mana"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <Sparkles />
              Mana
            </NavLink>
          </li>
        </ul>
        <span className={styles.citizen}>{citizen?.nickname}</span>
        <button className={styles.logout} onClick={() => void logout()}>
          <LogOut />
          Dismiss
        </button>
      </div>
    </nav>
  );
}
