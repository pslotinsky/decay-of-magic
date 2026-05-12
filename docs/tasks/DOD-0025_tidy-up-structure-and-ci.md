# DOD-0025: Tidy up structure and CI

| Field     | Value                                                   |
| --------- | ------------------------------------------------------- |
| Status    | Done |
| Milestone | [Tidy Up II](../milestones/Milestone-006_tidy-up-ii.md) |
| Created   | 2026-05-12                                              |

## Description

Followup to [DOD-0017](./DOD-0017_clean-up-platform-configuration-inconsistencies.md) — extend the structural baseline to the workspace layout, the CI pipeline, and static dead-code analysis. Each item below is independently small but they share infrastructure (CI workflow, root `package.json`, `turbo.json`), so they land together to avoid back-to-back pipeline churn.

## Scope

### Documentation

- Remove the empty `docs/plans/` directory.

### Workspace layout

- Relocate `packages/poe` and `packages/zok` to `tools/{poe,zok}` — they are project tools, not shipped libraries, and the distinction is currently invisible.
- Update the `workspaces` glob in root `package.json` to include `tools/*`.
- Update task references in `turbo.json` (`@dod/poe#build`) and any internal imports.
- Normalize package names while files are moving: `poe` is `@dod/poe`, `zok` is bare `zok`. Pick one convention and apply it.

### CI pipeline

- Lift `lint` and `typecheck` jobs off `needs: build` — they don't require build artifacts in practice and currently block on a serial step.
- Replace the `actions/upload-artifact` + `download-artifact` dance with a shared turbo cache (GitHub Actions cache on `.turbo/` and `node_modules/.prisma`, or turbo remote cache).
- Expand the `test-api` matrix from `[citizen, universe]` to cover every realm with API tests (codex at minimum; gateway and vault if they ship `test:api` scripts).

### Static analysis

- Adopt [knip](https://knip.dev) at the repository root with a single `knip.config.ts`. Declare entry points per workspace (NestJS `src/main.ts` for realms, `index.html` for council-web, `bin` entries for poe/zok).
- Land the install + config as report-only; capture the baseline and triage dead code in the same task.
- Once the baseline is clean, gate CI on knip (non-zero exit on findings).
- Escape hatch: if the first run surfaces more than ~30 findings, split adoption into a follow-up task — install lands here, triage moves out.

## Result

The monorepo separates shipped packages from project tools, CI delivers feedback faster without artifact passing, every realm with API tests is covered in the matrix, and knip catches dead code before it accumulates.
