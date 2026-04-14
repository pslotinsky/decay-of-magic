export async function req<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(path, { ...options, credentials: 'include' });
  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? res.statusText);
  }

  const text = await res.text();

  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}
