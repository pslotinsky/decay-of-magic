# DOD-0028: Migrate to Biome

| Field     | Value                                                   |
| --------- | ------------------------------------------------------- |
| Status    | Done                                                    |
| Milestone | [Tidy Up II](../milestones/Milestone-006_tidy-up-ii.md) |
| Created   | 2026-05-12                                              |

## Description

Replace Prettier + ESLint with [Biome](https://biomejs.dev/) as the single formatter, linter, and import-sorter for the monorepo. One root `biome.json` replaces ten `eslint.config.mjs` files, `.prettierrc`, and the shared `@dod/config/eslint/*` exports. Roughly an order of magnitude faster than the current pipeline, and removes most of the lint-related devDeps.

## Scope

- Add `@biomejs/biome` as a root devDep. Remove `eslint`, `prettier`, and all related plugins from every workspace.
- Delete the per-workspace `eslint.config.mjs` files, `.prettierrc`, and the `@dod/config/eslint/*` entries.
- Write a root `biome.json`: match the current Prettier output (2-space indent, line width 80, single quotes, trailing commas), enable parameter decorators for NestJS, configure `assist.actions.source.organizeImports.groups` to reproduce the existing `external → @dod/* → @/* → relative → *.{css,scss}` layout, and disable `noNonNullAssertion` (clashes with NestJS DI idiom).
- Auto-fix the safe findings (`useImportType`, `useNodejsImportProtocol`, `useLiteralKeys`, etc.). Fix real bugs surfaced by `noAssignInExpressions`, `noArrayIndexKey`, `useExhaustiveDependencies`. Accept Biome's a11y rules in council-web.
- Collapse the per-workspace `lint` / `format` / `format:check` scripts to a single root invocation. Drop the corresponding turbo tasks; CI runs `biome check` once.

The five `typescript-eslint` type-aware rules currently set to `warn` (`no-floating-promises`, `no-unsafe-*`) are dropped — Biome doesn't do type-aware lint. `tsc --noEmit` remains the type-safety gate.

## Result

One config, one tool, one CI step for everything that today is split across Prettier, ESLint, and ten per-workspace configs.
