# DOD-0019: Define API conventions for realm services

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Status    | Done                                                                                            |
| Milestone | [Platform Baseline & Consistency](../milestones/Milestone-004_platform-baseline-consistency.md) |
| Created   | 2026-04-19                                                                                      |

## Description

Describe principles for designing HTTP APIs across realms.

The document should define:

- structure of success responses
- structure of error responses
- conventions for create/update/delete operations
- versioning approach
- naming conventions for endpoints and DTOs

Goal: ensure new realms expose consistent APIs without requiring case-by-case decisions.

## Outcome

The task expanded past documentation into implementation and enforcement across the platform.

**Documentation**

- [Design-005: API Guidelines](../design/Design-005_api-guidelines.md) — wire protocol (URLs, verbs, status codes, success and error envelopes, naming, versioning). Explicit exceptions for cookie-auth endpoints and domain-significant operation verbs (`register`, `upload`, `logout`, …).
- [Design-004: Realms Blueprint](../design/Design-004_realms-blueprint.md) — command-handler example switched to domain errors; `main.ts` example shows the new platform hooks; Core abstractions table grouped into domain primitives, domain errors, and HTTP glue.

**New package: `@dod/api-contract`**

Owns the wire-level types and Zod schemas — single source of truth for both realms and the web client:

- `SuccessEnvelope<T>` + `unwrap<T>()`
- `ErrorEnvelope`, `ErrorDetail`
- `ErrorCode` enum
- Per-realm schemas and inferred types under `contracts/`: `CitizenSchema`/`CitizenDto`, `UniverseSchema`/`UniverseDto`, `CardSchema`/`CardDto`, `ManaSchema`/`ManaDto`, `FileSchema`/`FileDto`, `SessionSchema`/`SessionDto`, plus the matching `Create*` / `Update*` shapes. Convention: the schema (const) is `XxxSchema`, the inferred type is `XxxDto`.
- Runtime dep: `zod`. No Nest or React deps — safe to bundle in the web client.

**`@dod/core` additions**

- Domain errors: `DomainError` base + `NotFoundError`, `ConflictError`, `UnauthenticatedError`, `ForbiddenError`, `UnprocessableError`, `BadRequestError`, `ValidationFailedError`. Thrown by `law`/`lore`, mapped at the frontier.
- HTTP glue: `EnvelopeInterceptor`, `ErrorFilter`, `@NoEnvelope()` decorator, `ZodPipe` + `@ZodBody(schema)` / `@ZodQuery(schema)` / `@ZodParam(name, schema)` decorator factories.
- `PrismaRepository.getByIdOrFail` now raises `NotFoundError` instead of Nest's `NotFoundException`.
- Dropped: `createValidationPipe()` (replaced by the Zod decorators) and the class-validator peer dep.

**Realm alignment**

- `citizen`, `universe`, `codex`, `vault`, `gateway` — `main.ts` wires `EnvelopeInterceptor` + `ErrorFilter` globally; body validation happens per-endpoint via `@ZodBody`.
- `law/` handlers throw domain errors (never Nest exceptions) and return DTOs via `XxxSchema.parse(entity)` — runtime enforcement of the outgoing wire shape.
- `frontier/dto/` directories **removed** from all realms; the wire shape has one home (`@dod/api-contract`).
- `codex` aligned with conventions: `find` → `list` renames; `POST` endpoints return the created `XxxDto` instead of `void`; commands extend `Command<XxxDto>`.
- `vault` — env validation via Zod colocated with the handler that uses it; handler removed all defensive `throw new Error` guards; `FileSchema.parse({ ...file, url })` emits the wire shape.
- `gateway` proxy controllers forward upstream envelopes verbatim via `@Res()` (no double-wrapping); JWT middleware throws `UnauthenticatedError`; session controller handles the cookie-auth exception.
- Health endpoints moved to `/api/v1/health` and marked with `@NoEnvelope()` so Terminus format isn't wrapped.
- Domain types that happen to match the wire (e.g., `ManaType`) stay inside `lore` — the domain must not depend on `@dod/api-contract`. Contracts mirror the same string values as a Zod enum independently.
- Dropped from every realm's deps: `class-validator`, `class-transformer`, `@nestjs/swagger`. No Swagger UI is wired; the OpenAPI surface is defined by the Zod schemas in `@dod/api-contract`.

**Client alignment (`apps/council-web`)**

- Depends on `@dod/api-contract` directly — no Nest in the bundle.
- Imports types (`CitizenDto`, `UniverseDto`, `CreateUniverseDto`, …) straight from `@dod/api-contract`; `api/*.ts` modules expose only hooks, no re-exports.
- `client` module returns `SuccessEnvelope<T>` so consumers can access `meta`; query hooks use tanstack's `select` to surface `data`.
- `CardPreview` component aligned with the wire `CardDto` (`imageUrl`, `manaId`) — stale `image`/`schoolId` shape removed.

**Tests**

- `citizen` + `universe` e2e suites updated to expect envelopes via `unwrap<T>()` from `@dod/api-contract`. All 41 tests pass after the Zod migration.

**Infrastructure**

- Dockerfiles (`citizen`, `universe`, `codex`, `vault`, `gateway`, `council-web`) build `@dod/api-contract` alongside `@dod/core` in the installer stage and copy the built artifacts into dev/prod stages.
- docker-compose healthchecks point at `/api/v1/health`.
