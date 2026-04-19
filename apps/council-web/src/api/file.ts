import { useMutation } from '@tanstack/react-query';

import { client } from './client';

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'cover');
      return client.post('/api/v1/file', { body: formData }).text();
    },
  });
}
