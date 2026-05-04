import { ImagePlus, Loader } from 'lucide-react';
import { useRef, useState } from 'react';

import type { FileTransformDto } from '@dod/api-contract';

import { useUploadFile } from '@/api/file';
import { ImageEditor } from '@/components/ImageEditor';

import styles from './ImageInput.module.scss';

interface Props {
  value: string;
  onChange: (url: string) => void;
  aspect?: number;
}

export function ImageInput({ value, onChange, aspect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { mutate, isPending } = useUploadFile();

  function handlePick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPendingFile(file);
  }

  function handleConfirm(transform: FileTransformDto) {
    if (!pendingFile) return;
    const file = pendingFile;
    setPendingFile(null);
    mutate({ file, transform }, { onSuccess: onChange });
  }

  return (
    <>
      <button
        type="button"
        className={styles.area}
        style={aspect ? { aspectRatio: aspect, width: 'auto' } : undefined}
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
          onChange={handlePick}
        />
      </button>
      {pendingFile && (
        <ImageEditor
          file={pendingFile}
          aspect={aspect}
          onCancel={() => setPendingFile(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
