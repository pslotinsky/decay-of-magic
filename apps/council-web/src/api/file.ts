import { useMutation } from '@tanstack/react-query';

import type { FileDto, FileTransformDto } from '@dod/api-contract';

import { client } from './client';

interface UploadInput {
  file: File;
  transform?: FileTransformDto;
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ file, transform }: UploadInput): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'cover');

      if (transform) {
        formData.append('transform', JSON.stringify(transform));
      }

      const envelope = await client.upload<FileDto>('/api/v1/file', formData);
      return envelope.data.url;
    },
  });
}
