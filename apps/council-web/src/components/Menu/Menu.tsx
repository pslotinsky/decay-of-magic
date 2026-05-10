import { clsx } from 'clsx';
import { createContext, type ReactNode, useContext } from 'react';

import styles from './Menu.module.scss';

type MenuRole = 'listbox' | 'menu';

const MenuRoleContext = createContext<MenuRole>('menu');

interface MenuProps {
  role?: MenuRole;
  className?: string;
  children: ReactNode;
}

export function Menu({ role = 'menu', className, children }: MenuProps) {
  return (
    <MenuRoleContext.Provider value={role}>
      <ul className={clsx(styles.list, className)} role={role}>
        {children}
      </ul>
    </MenuRoleContext.Provider>
  );
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  icon?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export function MenuItem({
  children,
  onClick,
  selected,
  icon,
  extra,
  className,
}: MenuItemProps) {
  const role = useContext(MenuRoleContext);
  const itemRole = role === 'listbox' ? 'option' : 'menuitem';
  return (
    <li
      role={itemRole}
      aria-selected={role === 'listbox' ? !!selected : undefined}
    >
      <button
        type="button"
        className={clsx(
          styles.item,
          selected && styles.itemSelected,
          className,
        )}
        onClick={onClick}
      >
        {icon && <span className={styles.itemIcon}>{icon}</span>}
        <span className={styles.itemLabel}>{children}</span>
        {extra && <span className={styles.itemExtra}>{extra}</span>}
      </button>
    </li>
  );
}

interface MenuGroupProps {
  label: string;
  children: ReactNode;
}

export function MenuGroup({ label, children }: MenuGroupProps) {
  return (
    <li className={styles.group} role="group" aria-label={label}>
      <div className={styles.groupLabel}>{label}</div>
      <ul className={styles.list}>{children}</ul>
    </li>
  );
}
