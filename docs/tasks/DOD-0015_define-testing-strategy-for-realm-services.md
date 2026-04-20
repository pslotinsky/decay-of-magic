# DOD-0015: Define testing strategy for realm services

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Status    | Done |
| Milestone | [Platform Baseline & Consistency](../milestones/Milestone-004_platform-baseline-consistency.md) |
| Created   | 2026-04-19                                                                                      |

## Description

Describe the testing approach used for realm services.

Clarify:

- which test levels are used
- why API tests with real infrastructure are the default for each gate
- when unit and use-case (flow) tests earn their place over default API coverage
- how cross-realm interactions are tested without booting multiple realms
- when a real cross-realm end-to-end harness becomes relevant
- naming conventions for test types (avoid ambiguity of "e2e")

Goal: make testing expectations explicit and prevent inconsistent strategies across realms.

## Outcome

The task landed a design doc plus the rename and folder reshape meaningful under the current state. Contract instrumentation, flow tests, and the cross-realm e2e app are documented as the target but not yet implemented — there is nothing to cover with them today.

**Documentation**

- [Design-006: Realms Testing](../design/Design-006_realms-testing.md) — four test levels (unit, flow, API, e2e), what each proves, when to write, where each lives. Contracts reframed as instrumentation used inside whichever level touches the boundary, not a level of their own. Naming table reserves "e2e" for the cross-realm level only. Principle: a realm's test suite never boots another realm; external realms are contract-stubbed.
- [Design-004: Realms Blueprint](../design/Design-004_realms-blueprint.md) — example directory listing updated to reflect `jest-api.json` and `thing.api-spec.ts`.

**Rename: `e2e` → `api` for single-realm tests**

The existing suites were mislabelled — they're API-level, not e2e. Rename aligns vocabulary with Design-006 and frees "e2e" for the future cross-realm harness.

- `realms/{citizen,universe}/test/*.e2e-spec.ts` → `*.api-spec.ts`; `describe('… (e2e)')` → `describe('… (api)')`.
- `jest-e2e.json` → `jest-api.json` in both realms; `testRegex` updated.
- Package scripts: `test:e2e` → `test:api` in both realms, with the `test` composite updated accordingly.
- `turbo.json`: pipeline task `test:e2e` → `test:api`.
- `.github/workflows/ci.yml`: job `test-e2e` → `test-api`, command `turbo test:api`.

**Folder layout: `test/<level>/`**

One folder per level keeps the "what is this test?" question answerable from the path alone.

- `realms/citizen/test/api/{citizen,session}.api-spec.ts`
- `realms/universe/test/api/universe.api-spec.ts`
- Shared setup (`global-setup.ts`, `setup.ts`, `tsconfig.json`) stays at `test/` root. Jest `rootDir: "."` + recursive `testRegex` discover the relocated specs without config changes.
- `test/unit/` and `test/flow/` are documented in Design-006 but not created — no tests to put there yet.

**Design-only, not implemented**

- Flow level — appears when a handler grows branching or preconditions beyond pure dispatch.
- Contract instrumentation (producer-side response schema assertions, consumer-side stub clients) — appears with the first cross-realm call; the `@dod/api-contract` package already exists as the home.
- Cross-realm e2e application — appears when a flow cannot be covered by unit + flow + API + contracts combined. Lives under `apps/`, depends only on `@dod/api-contract`.
- Contract broker tooling, shared test-kit package, schema-per-worker DB isolation — open topics in Design-006.
