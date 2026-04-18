import { type TextareaHTMLAttributes, useEffect, useRef } from 'react';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(resize, [props.value]);

  return <textarea ref={ref} rows={1} onInput={resize} {...props} />;
}
