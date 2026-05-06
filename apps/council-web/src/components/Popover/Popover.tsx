import {
  cloneElement,
  type CSSProperties,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import styles from './Popover.module.scss';

interface Coords {
  placement: 'below' | 'above';
  top?: number;
  bottom?: number;
  right: number;
  maxHeight: number;
}

interface TriggerProps {
  ref?: Ref<HTMLElement>;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  'aria-expanded'?: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ReactNode | (() => ReactNode);
  children: ReactElement<TriggerProps>;
}

function computeCoords(rect: DOMRect): Coords {
  const margin = 8;
  const gap = 4;
  const spaceBelow = window.innerHeight - rect.bottom - margin;
  const spaceAbove = rect.top - margin;
  const preferBelow = spaceBelow >= 200 || spaceBelow >= spaceAbove;

  return preferBelow
    ? {
        placement: 'below',
        top: rect.bottom + gap,
        right: window.innerWidth - rect.right,
        maxHeight: Math.max(0, spaceBelow - gap),
      }
    : {
        placement: 'above',
        bottom: window.innerHeight - rect.top + gap,
        right: window.innerWidth - rect.right,
        maxHeight: Math.max(0, spaceAbove - gap),
      };
}

export function Popover({ open, onOpenChange, content, children }: Props) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [layerEl, setLayerEl] = useState<HTMLDivElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || !triggerEl) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurement after mount
    setCoords(computeCoords(triggerEl.getBoundingClientRect()));

    function handleMouseDown(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      const inTrigger = triggerEl?.contains(target) ?? false;
      const inLayer = layerEl?.contains(target) ?? false;
      if (!inTrigger && !inLayer) {
        onOpenChangeRef.current(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChangeRef.current(false);
      }
    }
    function reposition() {
      if (triggerEl) {
        setCoords(computeCoords(triggerEl.getBoundingClientRect()));
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, triggerEl, layerEl]);

  if (!isValidElement<TriggerProps>(children)) {
    throw new Error(
      'Popover expects a single React element as its child trigger',
    );
  }

  const childOnClick = children.props.onClick;
  const trigger = cloneElement(children, {
    ref: setTriggerEl,
    'aria-expanded': open,
    onClick: (event: MouseEvent<HTMLElement>) => {
      childOnClick?.(event);
      if (!event.defaultPrevented) {
        onOpenChange(!open);
      }
    },
  });

  const layerStyle: CSSProperties | null = coords
    ? {
        ...(coords.placement === 'below'
          ? { top: coords.top }
          : { bottom: coords.bottom }),
        right: coords.right,
        maxHeight: coords.maxHeight,
      }
    : null;

  return (
    <>
      {trigger}
      {open &&
        layerStyle &&
        createPortal(
          <div ref={setLayerEl} className={styles.layer} style={layerStyle}>
            {typeof content === 'function' ? content() : content}
          </div>,
          document.body,
        )}
    </>
  );
}
