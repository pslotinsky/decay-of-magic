# DOD-0021: Codex law & lore

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | In progress                                               |
| Milestone | [Codex Realm](../milestones/Milestone-005_codex-realm.md) |
| Created   | 2026-04-22                                                |

## Description

Implement the Codex domain (`lore`) and application logic (`law`) against the contracts from DOD-0020.

At this stage, repositories are backed by in-memory implementations used only by tests — no Prisma, no migrations. Persistence lands in DOD-0022.

See [Design-007: Codex Realm](../design/Design-007_codex-realm.md) for the realm-level overview and [Design-008: Card DSL](../design/Design-008_card-dsl.md) for the canonical authored grammar.

## Scope

### Use cases

- create, update, get, and list each Codex resource (Element, Faction, Stat, Trait, Card, Hero), scoped to a Universe
- compose Card and Hero abilities from a trigger (or `passive: true`), a target, an optional `exclude` expression, and an ordered list of effects with optional per-effect filters
- validate cross-resource references on write within the same Universe (a Card's cost references Elements, factions reference Factions, a `summon` effect references another Card with `activation: emptySlot`)
- validate dictionary references on write — every trait and stat slug used on a Card or Hero (in the prototype's `traits`/`stats` fields, in `giveTraits`/`removeTraits` effect params, or in `increaseStat`/`decreaseStat`/`multiplyStat`/`setStat` effect params) must resolve to an existing Trait/Stat in the same Universe, and that dictionary entry's `appliesTo` must include the entity type the slug is attached to (per [Design-007 — Dictionaries](../design/Design-007_codex-realm.md#dictionaries))
- enforce the activation/stats coupling on Cards (`stats` required iff `activation` is `emptySlot`)
- enforce trigger-vs-passive mutual exclusion on every ability
- enforce that `chosen` is not referenced on cards with `activation: immediate`
- validate effect `kind` values against the engine's effect registry and `params` against each kind's declared schema
- validate expression structure (known roots for dotted-path reads; known operator keys with correct arity)

### Entities

- **Element** — a fundamental currency or affinity in a Universe
- **Faction** — a grouping of Heroes and Cards expressing identity and mechanical synergy
- **Stat** — a numeric attribute slug a Universe permits on its entities (`attack`, `health`, `fireGrowth`, …); declares `appliesTo`
- **Trait** — a tag slug a Universe permits on its entities (`wall`, `charge`, `spell`, …); declares `appliesTo`
- **Card** — the primary playable object. Spell cards resolve immediately; summon-style cards (`activation: emptySlot`) carry a minion's stats and traits inline on the card prototype
- **Hero** — a playable character defining the player's identity and starting state

### Authored grammar (per Design-008)

The value-object structure inside Cards and Heroes:

- **Cost** — map of Element id → positive integer
- **Ability** — `trigger` (or `passive: true`), `target`, optional `exclude`, ordered `effects`
- **Trigger** — engine-published camelCase event name (`onPlay`, `onTurnStart`, …)
- **Target** — engine-published candidate-set slug (`self`, `chosen`, `enemyMinions`, …)
- **Effect** — `kind` from the engine's effect registry, `params` per the kind's schema, optional `filter`
- **Expression** — literal, dotted-path read, or structured operator node (used in `exclude`, `filter`, and effect params)

### Implementation

- `lore` abstract repositories for each entity
- `law` command handlers: create and update per entity
- `law` query handlers: get-by-id and list-by-universe per entity
- `universeId` handling per tenancy policy — queries use it as a filter, command handlers validate it internally
- in-memory repository implementations used by the API test harness

## Result

All contract tests from DOD-0020 pass against in-memory repositories. The domain is complete and the realm is runnable under test, pending real persistence.
