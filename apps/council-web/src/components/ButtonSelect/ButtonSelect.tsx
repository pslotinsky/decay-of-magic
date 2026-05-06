import { clsx } from 'clsx';
import { type ReactNode, useState } from 'react';

import { Menu, MenuItem } from '@/components/Menu';
import { Popover } from '@/components/Popover';

import styles from './ButtonSelect.module.scss';

export interface ButtonSelectOption<T extends string> {
  value: T;
  label?: string;
  description?: string;
  icon?: ReactNode;
}

interface Props<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: ButtonSelectOption<T>[];
  ariaLabel?: string;
  className?: string;
}

export function ButtonSelect<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === value);

  function selectOption(next: T) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div className={clsx(styles.wrap, className)}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={() => (
          <Menu role="listbox" className={styles.menu}>
            {options.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === value}
                icon={option.icon}
                onClick={() => selectOption(option.value)}
              >
                {option.description ?? option.label ?? option.value}
              </MenuItem>
            ))}
          </Menu>
        )}
      >
        <button
          type="button"
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          title={current?.description ?? current?.label}
        >
          {current?.icon ?? current?.label ?? value}
        </button>
      </Popover>
    </div>
  );
}
