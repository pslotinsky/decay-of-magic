import { createContext } from 'react';

import type { CitizenDto } from '@/queries/citizen';

export type { CitizenDto };

export interface AuthContextValue {
  citizen?: CitizenDto;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
