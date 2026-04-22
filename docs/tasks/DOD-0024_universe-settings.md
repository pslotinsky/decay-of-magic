# DOD-0024: Universe settings

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | In progress                                               |
| Milestone | [Codex Realm](../milestones/Milestone-005_codex-realm.md) |
| Created   | 2026-04-22                                                |

## Description

Extend the Universe realm to carry **settings** — a bundle of per-realm configuration stored on each Universe.

The first consumer is Codex: each Universe customizes how its Codex content appears (labels, theme, presentation choices). The mechanism is open: future realms (Battle, Vault, …) add their own settings schemas into the same bundle without touching Universe storage.

This slice is not MVP-blocking — DOD-0020 → DOD-0023 ship Codex with a fixed default presentation. Universe settings lands within the same milestone, with the concrete `CodexSettingsSchema` shaped by real customization needs surfaced while building the rest of the realm.

## Scope

### Contract (`@dod/api-contract`)

- `UniverseSettingsSchema` composed from per-realm settings schemas — `{ codex: CodexSettingsSchema, … }`. `CodexSettingsSchema` ships from the Codex realm.
- `CreateUniverseSchema` and `UpdateUniverseSchema` gain a `settings` field — required on create, partial at realm granularity on update.
- `UniverseSchema` response includes `settings`.

### Universe realm (`realms/universe`)

- `Universe` lore entity gains a `settings` field.
- Prisma schema adds a `settings jsonb` column; migration defaults existing rows to the per-realm defaults.
- Create and update commands validate `settings` at the gate via Zod and persist it.
- `GET /universe/:id` returns full settings; `GET /universe` list view omits them to keep the list light.
- PATCH semantics: each realm's settings sub-object is replaced wholesale; omitted keys preserve existing values.

### Codex settings (initial schema — TBD)

Concrete fields land when customization needs surface in practice. Candidate areas:

- per-Universe display labels for Codex entity types (e.g. call Cards "deals" in Cyber Deal)
- theme tokens (palette, card frame style)
- presentation choices (compact vs spacious card layout, faction badge style)

The specific schema is intentionally left open here — it should be driven by real customization needs, not speculation.

### Council UI

- Universe create and edit forms gain a settings section.
- Codex settings editor renders the fields defined by `CodexSettingsSchema` once that schema is pinned.
- Future realms plug their own settings editors into the same section as they ship.

## Result

A Universe is created or updated with its settings in one request; settings persist, validate via shared Zod schemas, and are returned on read. Codex (and later realms) read per-Universe settings to drive presentation.
