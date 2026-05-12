import { AsyncLocalStorage } from 'node:async_hooks';

import type { Plea } from './entities/Plea';

export const pleaContext = new AsyncLocalStorage<Plea>();
