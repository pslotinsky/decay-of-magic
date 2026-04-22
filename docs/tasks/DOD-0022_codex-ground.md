# DOD-0022: Codex ground

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | In progress                                               |
| Milestone | [Codex Realm](../milestones/Milestone-005_codex-realm.md) |
| Created   | 2026-04-22                                                |

## Description

Implement Codex persistence (`ground`) against the abstract repositories defined in DOD-0021.

## Scope

- Prisma schema for Codex with one table per entity (Element, Faction, Stat, Trait, Card, Hero), each row carrying indexable metadata (`id`, `universe_id`, `name`) plus a `payload` jsonb column for the rest of the authored shape (cost, stats, traits, activation, abilities, appliesTo, elements, …) per [Design-008](../design/Design-008_card-dsl.md) and [Design-007 — Dictionaries](../design/Design-007_codex-realm.md#dictionaries)
- initial migration
- Prisma service and repository implementations binding to the abstract contracts from `lore`
- module wiring swaps Prisma implementations in place of the in-memory ones from DOD-0021

## Result

All contract tests from DOD-0020 pass against real Postgres. Codex is deployable; authored content persists across restarts and is readable by other realms through the API.
