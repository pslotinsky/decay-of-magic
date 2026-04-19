# DOD-0018: Refactor frontend api layer

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Status    | Done |
| Milestone | [Platform Baseline & Consistency](../milestones/Milestone-004_platform-baseline-consistency.md) |
| Created   | 2026-04-19                                                                                      |

## Description

Adopt `@tanstack/react-query` with `ky` as the standard data-fetching stack for all frontend applications.

Rationale:

- separates server state from UI state cleanly
- provides caching, background refetching, and loading/error states out of the box
- eliminates ad-hoc `useEffect`/`useState` fetch patterns
- consistent invalidation model across mutations
- `ky` replaces a custom fetch wrapper — handles JSON serialization, credentials, and typed responses with less boilerplate

Conventions:

- all server communication lives in `src/api/<domain>.ts` per feature domain
- query hooks are named `use<Resource>Query`, mutation hooks are named `use<Action>Mutation`
- query keys are defined as a `<domain>Keys` object at the top of each file for consistent invalidation
- input types are extracted as named types (`CreateUniverseInput`, `UpdateCitizenInput`, etc.) — no inline types in function signatures
- `ky` is configured once in `src/api/client.ts` with `credentials: 'include'` and a global 401 hook that dispatches an `unauthorized` event
- `QueryClientProvider` is mounted at the app root in `main.tsx` with a shared `QueryClient` instance
- auth state (`/api/v1/citizen/me`) is managed via `useMeQuery` with `staleTime: Infinity` — only refetched after login
