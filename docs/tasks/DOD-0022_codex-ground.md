# DOD-0022: Codex ground

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | Done                                                      |
| Milestone | [Codex Realm](../milestones/Milestone-005_codex-realm.md) |
| Created   | 2026-04-22                                                |

## Description

Implement Codex persistence (`ground`) against the abstract repositories defined in DOD-0021.

## Scope

- Prisma schema for Codex with a single `archetype` table holding all kinds (Element, Faction, Stat, Trait, Card, Hero), discriminated by a `kind` column. Each row carries indexable metadata (`id`, `universe_id`, `kind`, `name`) plus a `payload` jsonb column for the rest of the authored shape (cost, stats, traits, activation, abilities, appliesTo, elements, …) per [Design-008](../design/Design-008_card-dsl.md) and [Design-007 — Dictionaries](../design/Design-007_codex-realm.md#dictionaries). Composite primary key on `(universe_id, id)` so ids are unique per Universe across kinds — matching the in-memory key shape used in DOD-0021.
- initial migration
- Prisma service and repository implementation binding to the abstract `ArchetypeRepository` contract from `lore`
- module wiring swaps the Prisma implementation in place of the in-memory one from DOD-0021

## Tests

The DOD-0021 contract test suite is split into three layers, each at its own seam:

- **Unit specs** (`@dod/api-contract`, `test:unit`): pure Zod tests on `Create*Schema` / `Update*Schema`. All shape/validation rules — required fields, length limits, slug format, `appliesTo` enum, activation/stats coupling, ability shape, effect kind & params, expression operator/arity. No NestJS, no DB.
- **Flow specs** (codex, `test:flow`): handler-level tests via `CommandBus` / `QueryBus` against `InMemoryArchetypeRepository`. Business rules — id-uniqueness 409, list scoped by `universeId`, get/update 404, partial-update merge for Card / Hero. No HTTP, no DB.
- **API specs** (codex, `test:api`): HTTP smoke tests via `supertest` against real Postgres. Verifies wiring and persistence — happy-path create / read / update, plus persistence-flavored cases (409 duplicate, list isolation, 404).

## Result

All flow tests pass against in-memory repositories and all API tests pass against real Postgres. Codex is deployable; authored content persists across restarts and is readable by other realms through the API.
