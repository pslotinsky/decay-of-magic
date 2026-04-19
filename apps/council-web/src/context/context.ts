import { createContext } from 'react';

import type { CitizenDto } from '@/api/citizen';

export type { CitizenDto };

export interface AuthContextValue {
  citizen?: CitizenDto;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
