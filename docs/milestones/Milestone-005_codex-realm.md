# Milestone-005: Codex Realm

| Field   | Value                                |
| ------- | ------------------------------------ |
| Status  | In progress                          |
| Roadmap | [MVP](../roadmaps/Roadmap-01_mvp.md) |
| Created | 2026-04-22                           |

## Goal

Introduce **Codex** as the repository of game content — the canonical templates of everything that *can exist* in a game (Elements, Factions, Stats, Traits, Heroes, and Cards, plus the abilities and effects those cards carry).

Codex is read-only at runtime: Council authors content into it; Battle and Lab load a per-match snapshot at match start and never call back mid-match. Every record belongs to exactly one Universe, and no query crosses tenants.

See [Design-007: Codex Realm](../design/Design-007_codex-realm.md) for the realm-level overview and [Design-008: Card DSL](../design/Design-008_card-dsl.md) for the canonical authored grammar.

## Scope

This milestone includes:

- prototyping the Council authoring UX to shape Codex's API surface
- describing the Codex API, use cases, and tests against that API
- introducing Codex entities — Element, Faction, Stat, Trait, Card, Hero
- pinning the authored grammar — costs, abilities, triggers, targets, effects, expressions — per Design-008
- enforcing dictionary integrity — Card and Hero authoring validates trait and stat slugs against the Universe's Trait and Stat dictionaries, including `appliesTo` compatibility
- implementing persistence for Codex entities
- adding Codex authoring routes in admin UI
- introducing per-Universe Codex settings (display labels, theme, layout) — non-MVP slice that ships within this milestone

Out of scope (per Design-007 / Design-008):

- visual and audio effects (VFX/SFX deferred per Design-008)
- content versioning and durable match-time snapshots
- shared keyword abilities as first-class entities
- deckbuilding and hero-card restrictions
- localization
- authoring permissions (a Citizen / authorization concern)
- cross-Universe references

## Dictionaries

The realm's dictionary concept (Elements, Stats, Traits, plus damage-source tags as a content-side classification) is described in [Design-007 — Dictionaries](../design/Design-007_codex-realm.md#dictionaries). This milestone ships all three as first-class Codex resources:

- Element, Stat, and Trait have their own create / update / get / list endpoints (see [DOD-0020](../tasks/DOD-0020_codex-contracts-todo-tests.md)).
- Card and Hero authoring validates trait and stat slug references against these dictionaries on write: existence in the same Universe, plus `appliesTo` compatibility with the entity the slug is attached to.
- Council provides dictionary editors so designers can curate Stats and Traits as part of building a Universe's content (see [DOD-0023](../tasks/DOD-0023_codex-part-of-council.md)).

## Universe settings

[Universe settings](../tasks/DOD-0024_universe-settings.md) extends the Universe entity to carry per-realm settings — Codex is the first consumer, customizing how its content presents (display labels, theme tokens, layout choices). The mechanism is open: future realms (Battle, Vault, …) plug their own settings schemas into the same bundle.

This slice is **not MVP-blocking**: the rest of the milestone (DOD-0020 → DOD-0023) ships Codex with a fixed default presentation. Universe settings lands within the same milestone, with the concrete `CodexSettingsSchema` shaped by real customization needs rather than speculation.

## Tasks

<!-- TOC.START: task -->
- [ ] [DOD-0020: Codex contracts + todo tests](../tasks/DOD-0020_codex-contracts-todo-tests.md)
- [ ] [DOD-0021: Codex law & lore](../tasks/DOD-0021_codex-law-lore.md)
- [ ] [DOD-0022: Codex ground](../tasks/DOD-0022_codex-ground.md)
- [ ] [DOD-0023: Codex part of Council](../tasks/DOD-0023_codex-part-of-council.md)
- [ ] [DOD-0024: Universe settings](../tasks/DOD-0024_universe-settings.md)
<!-- TOC.END -->
