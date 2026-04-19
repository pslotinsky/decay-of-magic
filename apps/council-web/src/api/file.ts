import { useMutation } from '@tanstack/react-query';

import { client } from './client';

export type FileDto = {
  id: string;
  category: string;
  name: string;
  mimetype: string;
  url: string;
};

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'cover');
      const envelope = await client.upload<FileDto>('/api/v1/file', formData);
      return envelope.data.url;
    },
  });
}
