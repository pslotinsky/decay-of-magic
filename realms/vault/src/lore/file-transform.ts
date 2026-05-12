type FileCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type FileResize = {
  width: number;
  height: number;
};

type FileFormat = 'webp';

export type FileTransform = {
  crop?: FileCrop;
  resize?: FileResize;
  format?: FileFormat;
  quality?: number;
};
