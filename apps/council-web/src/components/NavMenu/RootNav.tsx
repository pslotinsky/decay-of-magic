import { Globe, Users } from 'lucide-react';
import { NavLink } from 'react-router';

import { navLinkClass, NavMenu } from './NavMenu';

import styles from './NavMenu.module.scss';

export function RootNav() {
  return (
    <NavMenu>
      <ul className={styles.links}>
        <li>
          <NavLink to="/universe" className={navLinkClass}>
            <Globe />
            Universes
          </NavLink>
        </li>
        <li>
          <NavLink to="/citizen" className={navLinkClass}>
            <Users />
            Register of Citizens
          </NavLink>
        </li>
      </ul>
    </NavMenu>
  );
}
