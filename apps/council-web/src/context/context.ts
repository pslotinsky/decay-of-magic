import { createContext } from 'react';

import type { CitizenDto } from '@dod/api-contract';

export interface AuthContextValue {
  citizen?: CitizenDto;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
