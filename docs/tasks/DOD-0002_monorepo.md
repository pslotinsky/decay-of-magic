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

Shared platform library (`packages/core`). Contains base classes reused across all NestJS services:

- `EntityRepository<TEntity>` — abstract domain repository interface
- `PrismaRepository<TEntity, TModel>` — abstract Prisma-backed repository base

### `@dod/config`

Shared tooling config library (`packages/config`). Single package for all shared configs:

- `packages/config/tsconfig/base.json` — minimal base tsconfig
- `packages/config/tsconfig/nestjs.json` — extends base; commonjs, decorators, strict
- `packages/config/tsconfig/react.json` — extends base; ESNext, bundler, DOM, noEmit
- `packages/config/eslint/base.js` — `eslint.configs.recommended` + prettier
- `packages/config/eslint/nestjs.js` — exports `nestjs(tsconfigRootDir)` factory; adds Node/Jest globals, `recommendedTypeChecked`
- `packages/config/eslint/react.js` — exports `react` config; adds React Hooks + react-refresh plugins

### Root tooling

- `turbo.json` — Turborepo pipeline (`build`, `prisma:generate`, `lint`, `test`)
- `.prettierrc` — single root prettier config (`singleQuote`, `trailingComma: all`)
- All Docker builds use root build context (`context: .`) for monorepo-aware multi-stage builds
