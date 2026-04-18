import { useCallback, useEffect, useState, type ReactNode } from 'react';

import type { CitizenDto } from '@/queries/citizen';

import { AuthContext } from './context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [citizen, setCitizen] = useState<CitizenDto | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setCitizen)
      .catch(() => setCitizen(undefined))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async () => {
    setCitizen(await fetchMe());
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/v1/session', {
      method: 'DELETE',
      credentials: 'include',
    });
    setCitizen(undefined);
  }, []);

  useEffect(() => {
    const handle = () => {
      void logout();
    };

    window.addEventListener('unauthorized', handle);

    return () => window.removeEventListener('unauthorized', handle);
  }, [logout]);

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ citizen, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

async function fetchMe(): Promise<CitizenDto | undefined> {
  const response = await fetch('/api/v1/citizen/me', {
    credentials: 'include',
  });

  return response.ok ? (response.json() as Promise<CitizenDto>) : undefined;
}
