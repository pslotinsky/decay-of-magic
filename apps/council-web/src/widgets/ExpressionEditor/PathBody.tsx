import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import type { Expression } from '@dod/api-contract';

import { Menu, MenuGroup, MenuItem } from '@/components/Menu';
import { Popover } from '@/components/Popover';

import { useExpressionEditorContext } from './context';
import { fieldGroups, PATH_ROOTS } from './expressions';

import styles from './ExpressionEditor.module.scss';

interface Props {
  value: Expression;
  onChange: (next: Expression) => void;
}

type Stage = { kind: 'roots' } | { kind: 'fields'; root: string };

interface ParsedPath {
  display: string;
  root: string;
  rest: string;
}

function parsePath(value: Expression): ParsedPath {
  const display = typeof value === 'string' ? value : 'self';
  const head = display.split('.')[0] ?? 'self';
  const isStandard = (PATH_ROOTS as readonly string[]).includes(head);
  const rest =
    isStandard && display.includes('.') ? display.slice(head.length + 1) : '';
  return {
    display,
    root: isStandard ? head : 'self',
    rest,
  };
}

export function PathBody({ value, onChange }: Props) {
  const { display, root, rest } = parsePath(value);

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: 'roots' });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setStage({ kind: 'roots' });
    }
  }

  function emit(nextRoot: string, nextField: string) {
    onChange(nextField ? `${nextRoot}.${nextField}` : nextRoot);
  }

  return (
    <div className={styles.pathRow}>
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        content={() =>
          stage.kind === 'roots' ? (
            <RootsStage
              onPick={(nextRoot) =>
                setStage({ kind: 'fields', root: nextRoot })
              }
            />
          ) : (
            <FieldsStage
              root={stage.root}
              customDraft={root === stage.root ? rest : ''}
              onBack={() => setStage({ kind: 'roots' })}
              onPick={(field) => {
                emit(stage.root, field);
                setOpen(false);
              }}
              onCustomChange={(suffix) =>
                emit(stage.root, suffix.replace(/^\./, ''))
              }
            />
          )
        }
      >
        <button
          type="button"
          className={styles.pathTrigger}
          aria-haspopup="menu"
          title={display}
        >
          {display}
        </button>
      </Popover>
    </div>
  );
}

interface RootsStageProps {
  onPick: (root: string) => void;
}

function RootsStage({ onPick }: RootsStageProps) {
  return (
    <div className={styles.pathMenu}>
      <div className={styles.pathMenuScroll}>
        <Menu role="menu">
          {PATH_ROOTS.map((entry) => (
            <MenuItem
              key={entry}
              extra={<ChevronRight size={14} />}
              onClick={() => onPick(entry)}
            >
              {entry}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
}

interface FieldsStageProps {
  root: string;
  customDraft: string;
  onBack: () => void;
  onPick: (field: string) => void;
  onCustomChange: (suffix: string) => void;
}

function FieldsStage({
  root,
  customDraft,
  onBack,
  onPick,
  onCustomChange,
}: FieldsStageProps) {
  const ctx = useExpressionEditorContext();
  const groups = fieldGroups(ctx);

  return (
    <div className={styles.pathMenu}>
      <button type="button" className={styles.pathMenuBack} onClick={onBack}>
        <ChevronLeft size={14} />
        <span>{root}</span>
      </button>
      <div className={styles.pathMenuScroll}>
        <Menu role="menu">
          <MenuItem onClick={() => onPick('')}>
            <span className={styles.pathMenuMuted}>(root only)</span>
          </MenuItem>
          {groups.map((group) => (
            <MenuGroup key={group.label} label={group.label}>
              {group.options.map((field) => (
                <MenuItem key={field} onClick={() => onPick(field)}>
                  {field}
                </MenuItem>
              ))}
            </MenuGroup>
          ))}
        </Menu>
        <div className={styles.pathMenuCustom}>
          <span className={styles.pathMenuGroupLabel}>custom</span>
          <input
            value={customDraft}
            onChange={(event) => onCustomChange(event.target.value)}
            placeholder="custom.path"
          />
        </div>
      </div>
    </div>
  );
}
