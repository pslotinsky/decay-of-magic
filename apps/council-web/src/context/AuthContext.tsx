import { type ReactNode, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { sessionKeys, useMeQuery } from '@/api/session';

import { AuthContext } from './context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: citizen, isPending } = useMeQuery();

  const logout = useCallback(async () => {
    try {
      await fetch('/api/v1/session', {
        method: 'DELETE',
        credentials: 'include',
      });
    } finally {
      queryClient.setQueryData(sessionKeys.me, undefined);
    }
  }, [queryClient]);

  useEffect(() => {
    const handle = () => {
      void logout();
    };

    window.addEventListener('unauthorized', handle);

    return () => window.removeEventListener('unauthorized', handle);
  }, [logout]);

  if (isPending) return null;

  return (
    <AuthContext.Provider value={{ citizen, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
