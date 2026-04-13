import { Link, NavLink } from 'react-router';

import rostraImg from '../../assets/rostra.webp';
import { useAuth } from '../../context/useAuth';
import styles from './NavMenu.module.scss';

export function NavMenu() {
  const { logout } = useAuth();

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
              to="/citizens"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
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
              Mana
            </NavLink>
          </li>
        </ul>
        <button className={styles.logout} onClick={logout}>
          Dismiss
        </button>
      </div>
    </nav>
  );
}
