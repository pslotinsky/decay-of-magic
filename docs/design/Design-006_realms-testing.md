# Design-006: Realms Testing

| Field   | Value      |
| ------- | ---------- |
| Created | 2026-04-19 |

## Overview

Rules for how realm services are tested, independent of language, framework, or test runner. Scope is the strategy: which levels exist, what each one proves, where tests live, and how realms interact with each other under test.

This doc describes the **target**. Existing test suites may diverge; new tests must conform.

Related: [Design-004: Realms Blueprint](./Design-004_realms-blueprint.md), [Design-005: API Guidelines](./Design-005_api-guidelines.md).

## Principles

1. **A realm's test suite never boots another realm.** External realms are replaced by contract-driven stubs. If a test requires two realms running together, it is not a realm test.
2. **Real infrastructure over mocks for the realm itself.** Realms are thin orchestrations over a database and a framework; risk lives at those boundaries. Tests that bypass them prove almost nothing.
3. **The contract is the single source of truth between realms.** Both sides of a cross-realm call import the same request/response schemas. Stubs on the consumer side and assertions on the producer side derive from that one contract.
4. **Write the test that catches the bug you actually ship.** CRUD handlers rarely break in isolation; they break at validation, uniqueness, migrations, and serialization. Target tests accordingly.

## Test levels

Four levels, in order of cost and scope:

| Level    | Boundary under test                                        | External realms | When to write                                                                 |
| -------- | ---------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------- |
| **Unit** | A single class with non-trivial behavior                   | n/a             | Class has invariants, state transitions, or computed fields. Skip data holders. |
| **Flow** | One use case through the application layer                 | stubbed         | Use case has branching, preconditions, or domain errors. Skip pure dispatch.  |
| **API**  | One realm, HTTP in → real database out                     | stubbed         | Always, one suite per gate.                                                   |
| **E2E**  | Gateway + two or more realms composed through real network | real            | Only when a flow cannot be covered by unit + flow + API + contracts combined. |

### Unit

Exercises a single class in isolation — typically an entity in `lore` with invariants, state transitions, or computed fields.

Write one when the class contains logic that can be stated independently of storage and transport. Skip when the class is a data holder; asserting a setter sets a field is not a test.

No dependencies loaded — no database, no framework, no HTTP.

### Flow

Exercises one use case — a single command or query handler — with its collaborators stubbed. Entry point is the handler's `execute`, not an HTTP request. Repositories and outbound clients to other realms are replaced with fakes or contract stubs.

What it covers:

- Business rules inside the handler: branching, preconditions, domain error paths.
- Orchestration across repositories, entities, and external clients.
- Consumer-side contract usage: the handler drives a stub client produced from another realm's contract.

What it does **not** cover:

- HTTP pipeline (validation pipe, envelope interceptor, error filter). Those are the API level's job.
- Persistence semantics that depend on real SQL (constraints, cascades, migration correctness). Those are the API level's job.

One suite per use case. Fast — no process boot, no DB round trip. Skip entirely for handlers that are pure dispatch (e.g., `getByIdOrFail` → DTO); the API level already covers them, and there is no flow logic to test.

### API

Exercises the whole realm: boots the application in-process, applies the full HTTP pipeline, and hits endpoints through real HTTP against a real database.

What it covers:

- HTTP contract: verbs, status codes, envelope shape, error codes.
- Validation: request DTO failures produce `VALIDATION_FAILED` with the expected `details[]`.
- Persistence semantics: uniqueness, cascading deletes, nullability, migrations applied correctly.
- Producer-side contract conformance: asserting real responses against the contract's response schema.

What it does **not** cover:

- Other realms. Any outbound client is injected as a contract stub, same as in flow tests.
- Exhaustive permutations of handler logic — that belongs in flow tests, which are cheaper.

One suite per resource or gate. Each test starts from a clean database state; the reset strategy (truncate, transactional rollback, per-test schema) is a realm-level decision, not a design concern.

### E2E

A real stack — gateway, two or more realms, real databases, real network — tested through the gateway's public API. Exists to catch failure modes that contract-driven flow and API tests cannot express: authentication crossing realms, sagas with compensating actions, gateway composition, cache coherence.

Not written by default. Created only when a specific flow exists that contract stubs demonstrably cannot cover. Treated as a release-gate smoke suite, not a per-commit tier.

E2E tests do not live inside any single realm. See [Location](#location).

## Contracts

Contracts are **instrumentation**, not a test level. A single contract is consumed at both ends: the producer asserts real responses match it, the consumer drives a stub built from it. The same schema flows through whichever level happens to touch the boundary.

A contract for a cross-realm endpoint is a module in `@dod/api-contract` that publishes:

- A request schema (for `POST` / `PATCH` bodies and query parameters).
- A response schema (for the envelope's `data` payload).
- The set of error codes the endpoint may raise.
- A typed client interface matching the endpoint.
- A stub factory that constructs a client instance from caller-provided scripted responses, validated against the response schema before being returned.

Both sides import from the same module. Neither realm imports from the other.

### Producer side

Inside API tests, the realm's real response goes through the contract's response schema. Schema drift fails the test. The realm is proving "I honor the contract I published."

### Consumer side

Inside flow tests (and, when needed, API tests), the real HTTP client is replaced with the contract's stub client. The consumer calls the stub; the stub emits scripted, schema-valid responses. The consumer is proving "I use the contract correctly."

The compile-time benefit is separate from either test: a breaking contract change makes every consumer's stub fail to typecheck before any test runs.

### What contracts do not prove

A stub that returns a contract-valid payload for an id that would 404 in reality is a lie no test can detect. Contracts catch shape drift and wiring mistakes — not semantic divergence between realms. That gap is what rare e2e tests are for.

## Ownership

Each endpoint has exactly one producer realm. The producer realm owns its contracts. Consumers may propose changes but never edit another realm's contract directly.

When a contract changes:

- Additive changes (new optional field, new endpoint, new error code) — no version bump, consumers opt in on their schedule.
- Breaking changes — a new contract version alongside the old. The [versioning rules from Design-005](./Design-005_api-guidelines.md#versioning) apply: one live major at a time in the normal case, multiple majors concurrent during migration.

Under the "current practice" clause of Design-005 (all consumers ship from the same repo), breaking contract changes land in lockstep across producer and consumers — the contract changes, every consumer breaks at compile time, every consumer is fixed in the same PR.

## Location

| Level | Lives in                                             |
| ----- | ---------------------------------------------------- |
| Unit  | `<realm>/test/unit/`                                 |
| Flow  | `<realm>/test/flow/`                                 |
| API   | `<realm>/test/api/`                                  |
| E2E   | A dedicated application, separate from every realm   |

Every realm-internal level lives in its own folder under `test/`, isolated from `src/`. One folder per level keeps the "what is this test?" question answerable from the path alone. Shared fixtures and helpers live in sibling folders (`test/fixtures/`, `test/helpers/`); cross-level setup stays at `test/` root.

E2E is an **application**, not a library: it has a runtime, orchestrates the stack, seeds state, tears down. Its only source-level dependency is `@dod/api-contract`; it never imports a realm's internals.

Implementation specifics — test runner, database reset strategy, orchestration tool — are intentionally out of scope here. They belong in realm- or app-level notes.

## Naming

"End-to-end" is ambiguous: browser-through-backend, single-service API, and cross-realm journey have all been called e2e somewhere. This design reserves the term:

| Term           | Refers to                                                          |
| -------------- | ------------------------------------------------------------------ |
| **Unit test**  | Unit level only.                                                   |
| **Flow test**  | Flow level — one use case, collaborators stubbed.                  |
| **API test**   | API level — single realm, real DB, external realms stubbed.        |
| **E2E test**   | Cross-realm only. Never used for single-realm API tests.           |

Test files and directories should follow the same vocabulary so a filename answers "what level is this?" without opening the file.

## Scope boundaries

- **Frontend tests** (UI behavior, browser journeys) are out of scope. They live with the frontend application and follow its own conventions.
- **Load and performance tests** are out of scope. If introduced, they become a separate level.
- **Security tests** beyond what API tests naturally cover (auth failures, authorization checks) are out of scope.

## Open topics

Intentionally unresolved; revisit when a first real need arrives:

- **Test data factories** shared across realms. Extract to a test kit only after the second duplication.
- **Contract broker tooling** (Pact-style) for when a non-monorepo consumer appears. Not needed while every consumer ships from this repo.
- **Parallel test execution** across realms in CI — currently each realm runs its own suite serially.
- **Schema-per-worker** database isolation to replace truncate-between-tests when suites grow large.
