import {
  type KeyboardEvent,
  type TextareaHTMLAttributes,
  useEffect,
  useRef,
} from 'react';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(resize, [props.value]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.stopPropagation();
    }
    props.onKeyDown?.(event);
  }

  return (
    <textarea
      ref={ref}
      rows={1}
      onInput={resize}
      {...props}
      onKeyDown={handleKeyDown}
    />
  );
}
