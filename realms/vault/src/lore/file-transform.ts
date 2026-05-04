export type FileCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FileResize = {
  width: number;
  height: number;
};

export type FileFormat = 'webp';

export type FileTransform = {
  crop?: FileCrop;
  resize?: FileResize;
  format?: FileFormat;
  quality?: number;
};
