import { useCallback, useState } from 'react';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';

import styles from './JsonEditor.module.scss';

interface Props<T> {
  defaultValue: T;
  onChange: (next: T) => void;
  onError?: (message: string | null) => void;
  height?: string;
}

const extensions = [json()];

export function JsonEditor<T = unknown>({
  defaultValue,
  onChange,
  onError,
  height = '240px',
}: Props<T>) {
  const [text, setText] = useState(() => JSON.stringify(defaultValue, null, 2));

  const handleChange = useCallback(
    (next: string) => {
      setText(next);
      try {
        onChange(JSON.parse(next) as T);
        onError?.(null);
      } catch (parseError) {
        onError?.(
          parseError instanceof Error ? parseError.message : 'Invalid JSON',
        );
      }
    },
    [onChange, onError],
  );

  return (
    <CodeMirror
      className={styles.editor}
      value={text}
      height={height}
      extensions={extensions}
      onChange={handleChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        bracketMatching: true,
        indentOnInput: true,
        autocompletion: false,
      }}
    />
  );
}
