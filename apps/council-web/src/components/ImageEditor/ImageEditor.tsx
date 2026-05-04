import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Cropper, { type Area } from 'react-easy-crop';

import type { FileTransformDto } from '@dod/api-contract';

import { Button } from '@/components/Button';
import { PillToggle } from '@/components/PillToggle';

import styles from './ImageEditor.module.scss';

const ASPECT_OPTIONS: { label: string; value: number }[] = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
];

interface Props {
  file: File;
  aspect?: number;
  defaultWidth?: number;
  defaultQuality?: number;
  onCancel: () => void;
  onConfirm: (transform: FileTransformDto) => void;
}

export function ImageEditor({
  file,
  aspect = 1,
  defaultWidth = 1600,
  defaultQuality = 80,
  onCancel,
  onConfirm,
}: Props) {
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [activeAspect, setActiveAspect] = useState(aspect);
  const [width, setWidth] = useState(defaultWidth);
  const [quality, setQuality] = useState(defaultQuality);

  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl]);

  function handleConfirm() {
    if (!croppedArea) return;
    const cropX = Math.max(0, Math.round(croppedArea.x));
    const cropY = Math.max(0, Math.round(croppedArea.y));
    const cropWidth = Math.max(1, Math.round(croppedArea.width));
    const cropHeight = Math.max(1, Math.round(croppedArea.height));
    const targetWidth = Math.max(1, Math.round(width));
    const targetHeight = Math.max(
      1,
      Math.round((targetWidth * cropHeight) / cropWidth),
    );

    onConfirm({
      crop: { x: cropX, y: cropY, width: cropWidth, height: cropHeight },
      resize: { width: targetWidth, height: targetHeight },
      format: 'webp',
      quality,
    });
  }

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit cover</h2>
          <button className={styles.close} onClick={onCancel} type="button">
            ✕
          </button>
        </div>
        <div className={styles.cropper}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={activeAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, area) => setCroppedArea(area)}
          />
        </div>
        <div className={styles.controls}>
          <div className={styles.field}>
            <span className={styles.label}>Aspect</span>
            <div className={styles.pills}>
              {ASPECT_OPTIONS.map((option) => (
                <PillToggle
                  key={option.label}
                  selected={Math.abs(activeAspect - option.value) < 0.0001}
                  onToggle={() => setActiveAspect(option.value)}
                >
                  {option.label}
                </PillToggle>
              ))}
            </div>
          </div>
          <label className={styles.field}>
            <span className={styles.label}>Output width (px)</span>
            <input
              type="number"
              min={64}
              max={4096}
              step={16}
              value={width}
              onFocus={(event) => event.currentTarget.select()}
              onWheel={(event) => event.currentTarget.blur()}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>WebP quality ({quality})</span>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
            />
          </label>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!croppedArea}>
            Save
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
