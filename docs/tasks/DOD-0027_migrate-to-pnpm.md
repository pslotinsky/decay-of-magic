# DOD-0027: Migrate to pnpm

| Field     | Value                                                   |
| --------- | ------------------------------------------------------- |
| Status    | Done |
| Milestone | [Tidy Up II](../milestones/Milestone-006_tidy-up-ii.md) |
| Created   | 2026-05-12                                              |

## Description

Swap the monorepo's package manager from npm to pnpm. The current npm setup works, so this is not a fix — it is an upgrade toward stricter dependency resolution and better long-term defaults for a project that already invests in tooling discipline (knip, Poe, Zok, ADR-006).

The migration sequences **after [DOD-0025](./DOD-0025_tidy-up-structure-and-ci.md)** so the workspace layout (`tools/{poe,zok}` move, `workspaces` glob change) is final before the lockfile and resolution model change. Knip's baseline from DOD-0025 also informs scope here: a noisy `unlisted` report turns this task into a concrete fixer-of-real-problems rather than a stylistic move.

## Why pnpm for this project

- **Strict resolution becomes enforced, not just linted.** Phantom dependencies cannot be imported at all. Knip catches them at lint time; pnpm catches them at runtime. For five NestJS realms with reflection-based DI, that's a real correctness improvement.
- **The council-web devDeps-only convention becomes a tooling rule.** pnpm respects the `dependencies` / `devDependencies` boundary that npm currently treats as a hint.
- **Lockfile diffs become readable** — `pnpm-lock.yaml` is git-diff-friendly, which matches the docs-as-code discipline.
- **Better trajectory than npm** — for a long-running pet project, choosing the tool with active improvement compounds.

Speed and disk savings exist but are not the rationale at solo scale.

## Scope

### Repository

- Add `pnpm-workspace.yaml` mirroring the current `workspaces` glob (`apps/*`, `realms/*`, `packages/*`, plus `tools/*` after DOD-0025 lands).
- Update `packageManager` in root `package.json` from `npm@…` to `pnpm@…` (corepack-pinned).
- Generate `pnpm-lock.yaml`; remove `package-lock.json`.
- Update `.npmrc` as needed (`auto-install-peers=true`, evaluate `node-linker` setting based on hoisting needs).

### Workspace scripts and references

- Replace npm-specific syntax in any internal scripts: `npm install -w <pkg>` → `pnpm --filter <pkg> add`, etc.
- Verify `turbo` continues to work — turbo supports pnpm workspaces out of the box, but confirm `--filter` syntax in CI matrix steps.
- Update root `package.json` `scripts` if any use npm-only flags.

### CI

- Swap `actions/setup-node` cache target from `npm` to `pnpm`, or add `pnpm/action-setup`.
- Replace `npm ci` with `pnpm install --frozen-lockfile` in every job.
- Verify the `docs` job's `npm rebuild --workspaces` step still works (pnpm equivalent: `pnpm rebuild --recursive`).

### Docker

- Update every `Dockerfile` under `apps/` and `realms/` to install pnpm (via corepack) and use `pnpm install` instead of `npm ci`.
- Verify image sizes don't regress (pnpm's content-addressable store needs the right copy strategy in multi-stage builds).

### Framework verification

- **NestJS realms** — confirm reflection metadata still resolves under pnpm's stricter hoisting. If imports break, prefer fixing the missing `dependencies` declarations over reaching for `shamefully-hoist=true`.
- **Prisma** — confirm client generation places artifacts where each realm expects (`node_modules/.prisma/client`).
- **Vite (council-web)** — confirm plugin resolution; rarely needs `node-linker=hoisted`.

### Dependabot

- Update `.github/dependabot.yml` (if present) or add one — pnpm is supported but the ecosystem key differs in some configs.

## Result

The monorepo runs on pnpm with strict, enforced dependency resolution. Phantom imports surface immediately rather than at the next deployment. Lockfile diffs are reviewable. CI install steps are faster on cache hit, comparable on cold runs. Every Dockerfile, CI job, and internal script uses pnpm consistently.
