import { useCallback, useState, type ReactNode } from 'react';

import { AuthContext } from './context';

const TOKEN_KEY = 'council_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: token !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
}
