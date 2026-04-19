import { ImagePlus, Loader } from 'lucide-react';
import { useRef } from 'react';

import { useUploadFile } from '@/api/file';

import styles from './ImageInput.module.scss';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function ImageInput({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadFile();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    mutate(file, { onSuccess: onChange });
    event.target.value = '';
  }

  return (
    <button
      type="button"
      className={styles.area}
      onClick={() => inputRef.current?.click()}
    >
      {value && <img className={styles.preview} src={value} alt="Cover" />}
      <div className={styles.overlay}>
        {isPending ? (
          <Loader className={styles.spin} size={48} />
        ) : (
          <ImagePlus size={48} />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hidden}
        onChange={handleChange}
      />
    </button>
  );
}
