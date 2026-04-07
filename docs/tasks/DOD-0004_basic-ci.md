# DOD-0004: Basic CI

| Field     | Value                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------- |
| Status    | Done                                                                                               |
| Milestone | [Infrastructure and documentation](../milestones/Milestone-001_infrastructure-and-documentation.md) |
| Created   | 2025-06-21                                                                                         |

## Description

GitHub Actions CI pipeline with lint, test, and automated API docs generation.

### `.github/workflows/ci.yml`

Two jobs:

**`ci`** — runs on every push and PR to `master`:
1. `npm ci`
2. `npm run build` — compiles all packages (including `prisma:generate`)
3. `npm run lint` — Turborepo lint across all packages
4. `npm run test` — Turborepo test across all packages

**`docs`** — runs only on push to `master` (after `ci` passes):
1. `npm run build`
2. `npm run docs -- <package>` for each package with a `src/` directory
3. Commits any changed `README.md` files back to `master` with `[skip ci]`

### `scripts/docgen.mjs`

Standalone Node.js script (no dependencies beyond Node built-ins).

Usage: `node scripts/docgen.mjs <package-path> [...]`

- Recursively scans `<path>/src/**/*.ts` (excludes `.spec.ts` and `.d.ts`)
- Extracts the first JSDoc comment above each `class` declaration
- Writes a Markdown table into `<path>/README.md` between `<!-- docgen:start -->` / `<!-- docgen:end -->` markers
- Creates `README.md` if it does not exist, using the package name as the heading
