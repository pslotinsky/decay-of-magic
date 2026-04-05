# DOD-0002: Monorepo

| Field     | Value                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------- |
| Status    | Done |
| Milestone | [Infrastructure and documentation](../milestones/Milestone-001_infrastructure-and-documentation.md) |
| Created   | 2025-06-21                                                                                         |

## Description

Set up the monorepo infrastructure for the **Days of Decay (DoD)** platform — the umbrella that hosts multiple games, with **Decay of Magic (DoM)** as the first. The monorepo uses npm workspaces with Turborepo for task orchestration.

### Workspace layout

```
apps/       # client applications (e.g. council-web)
services/   # microservices (e.g. codex-service, vault-service)
packages/   # shared platform libraries
```

### Package scopes

- `@dod/*` — platform-level shared packages (infrastructure, tooling)
- `@dom/*` — Decay of Magic game-specific packages

### `@dod/core`

The first shared platform library (`packages/core`). Contains base classes reused across all NestJS services:

- `EntityRepository<TEntity>` — abstract domain repository interface
- `PrismaRepository<TEntity, TModel>` — abstract Prisma-backed repository base
