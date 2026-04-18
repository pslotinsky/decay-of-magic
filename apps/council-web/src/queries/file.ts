import { useMutation } from '@tanstack/react-query';

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', 'cover');

  const res = await fetch('/api/v1/file', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  return res.text();
}

export function useUploadFile() {
  return useMutation({ mutationFn: uploadFile });
}
