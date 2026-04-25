# DOD-0020: Codex contracts + todo tests

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | Done                                                      |
| Milestone | [Codex Realm](../milestones/Milestone-005_codex-realm.md) |
| Created   | 2026-04-22                                                |

## Description

Define API contracts and expected behavior for the Codex realm.

The canonical authored grammar — Card / Hero prototypes, abilities, triggers, targets, effects, expressions — lives in [Design-008: Card DSL](../design/Design-008_card-dsl.md). This task pins those shapes to wire-level Zod schemas plus per-endpoint behavioral expectations.

All test scenarios land as `it.todo(...)` so DOD-0021 implements against a fixed spec. The Council prototype in DOD-0023 is the source of truth for which screens and flows each endpoint must support.

## Scope

### Resources

#### Element

- `id` — string, provided by the application; camelCase slug, unique per Universe
- `universeId` — string, required
- `name` — string, required, 1–50 characters

#### Faction

Same fields as Element.

#### Stat

Per [Design-007 — Dictionaries](../design/Design-007_codex-realm.md#dictionaries):

- `id` — string, provided by the application; camelCase slug, unique per Universe
- `universeId` — string, required
- `name` — string, required, 1–50 characters
- `appliesTo` — non-empty array of `minion` | `hero` | `card`; declares which entity types the stat may attach to

Runtime behaviour (e.g. `fireGrowth` feeding `fire`) is the engine's concern and is not authored on the dictionary entry.

#### Trait

Per [Design-007 — Dictionaries](../design/Design-007_codex-realm.md#dictionaries):

- `id` — string, provided by the application; camelCase slug, unique per Universe
- `universeId` — string, required
- `name` — string, required, 1–50 characters
- `appliesTo` — non-empty array of `minion` | `hero` | `card`; declares which entity types the trait may attach to

#### Card

Per [Design-008 — Card prototype](../design/Design-008_card-dsl.md#card-prototype):

- `id` — string, provided by the application; camelCase slug, unique per Universe
- `universeId` — string, required
- `name` — string, required, 1–100 characters
- `description` — string, optional, max 500 characters (rules text and flavor combined)
- `art` — string URL, optional (Vault asset for card artwork)
- `factions` — array of Faction ids, optional
- `cost` — map of Element id → positive integer, optional (empty means free)
- `stats` — map of stat-slug → integer-or-Expression, optional; required when `activation` is `emptySlot`, forbidden otherwise
- `traits` — array of trait-slug, optional
- `activation` — enum: `emptySlot` | `enemyMinion` | `ownerMinion` | `immediate`, required
- `abilities` — array of Ability, optional

Cards with `activation: emptySlot` carry the summoned minion's stats and traits inline; there is no separate Minion resource.

#### Hero

Per [Design-008 — Hero prototype](../design/Design-008_card-dsl.md#hero-prototype):

- `id`, `universeId`, `name`, `description` — same shape as Card
- `art` — string URL, optional (Vault asset for hero portrait)
- `faction` — single Faction id, optional
- `elements` — map of Element id → non-negative integer
- `stats` — map of stat-slug → integer-or-Expression, optional
- `traits` — array of trait-slug, optional
- `abilities` — array of Ability, optional

### Shared schemas

#### Ability

Per [Design-008 — Ability shape](../design/Design-008_card-dsl.md#ability-shape):

- exactly one of `trigger` (Trigger) or `passive` (boolean, must be `true`)
- `target` — Target slug, required
- `exclude` — Expression, optional (boolean predicate; truthy means drop the candidate from the resolved target set)
- `effects` — non-empty array of Effect

#### Trigger

camelCase enum drawn from the engine vocabulary. MVP set:

`onPlay`, `onTurnStart`, `onTurnEnd`, `onDeath`, `onDamaged`, `onBeforeDamage`, `onAttack`, `onBeforeAttack`, `onSummon`.

Damage triggers (`onBeforeDamage`, `onDamaged`) fire on the target side; attack triggers (`onAttack`, `onBeforeAttack`) fire on the source side.

`Passive` is **not** a Trigger value — passive abilities use `passive: true` instead.

#### Target

camelCase slug naming the candidate set. MVP set:

`self`, `ownerHero`, `enemyHero`, `chosen`, `neighbors`, `ownerMinions`, `enemyMinions`, `allMinions`.

#### Effect

Per [Design-008 — Effects: kind + params + filter](../design/Design-008_card-dsl.md#effects-kind--params--filter):

- `kind` — string naming an entry in the engine's effect registry
- `params` — kind-specific map; each registry entry declares its own param schema
- `filter` — Expression, optional (boolean predicate evaluated per candidate target)

MVP `kind` values (see the registry table in Design-008 for per-kind param schemas):

`damage`, `heal`, `fullHeal`, `gainElement`, `increaseStat`, `decreaseStat`, `multiplyStat`, `setStat`, `giveTraits`, `removeTraits`, `summon`, `destroy`, `attackNow`, `preventDamage`, `reflectDamage`.

#### Expression

Per [Design-008 — Expression grammar](../design/Design-008_card-dsl.md#expression-grammar):

- A literal — number, boolean, or string.
- A dotted-path read — string starting with one of the engine roots (`self`, `ownerHero`, `enemyHero`, `target`, `chosen`, `event`).
- A structured operator — single-key object, where the key is one of `not`, `and`, `or`, `eq`, `ne`, `lt`, `lte`, `gt`, `gte`, `add`, `sub`, `mul`, `div`, `min`, `max`, `contains`. The value is a list of operand Expressions; arity is fixed by the operator.

There is no infix operator syntax and no method-call syntax — predicates and arithmetic always use the structured form.

### Endpoints

```
POST   /v1/element
PATCH  /v1/element/:id
GET    /v1/element/:id
GET    /v1/element?universeId=:id

POST   /v1/faction
PATCH  /v1/faction/:id
GET    /v1/faction/:id
GET    /v1/faction?universeId=:id

POST   /v1/stat
PATCH  /v1/stat/:id
GET    /v1/stat/:id
GET    /v1/stat?universeId=:id

POST   /v1/trait
PATCH  /v1/trait/:id
GET    /v1/trait/:id
GET    /v1/trait?universeId=:id

POST   /v1/card
PATCH  /v1/card/:id
GET    /v1/card/:id
GET    /v1/card?universeId=:id

POST   /v1/hero
PATCH  /v1/hero/:id
GET    /v1/hero/:id
GET    /v1/hero?universeId=:id
```

Card endpoints cover both spell cards and summon-style cards; minion prototypes are inlined per [Design-007 — Card](../design/Design-007_codex-realm.md#card).

### Per-resource test scenarios

These apply to every resource (Element, Faction, Stat, Trait, Card, Hero). Substitute the resource name.

#### POST /v1/{resource}

- creates the resource and returns it
- returns 400 when `universeId` is missing
- returns 400 when `name` is missing
- returns 400 when `name` is empty
- returns 400 when `name` exceeds max length
- returns 409 when `id` already exists in the same Universe
- allows the same `id` in a different Universe

#### PATCH /v1/{resource}/:id

- updates writable fields
- returns 404 when the resource is not found
- returns 400 when `name` is empty

#### GET /v1/{resource}/:id

- returns the resource by id
- returns 404 when the resource is not found

#### GET /v1/{resource}?universeId=:id

- returns resources for that Universe
- returns empty array when the Universe has no resources of this kind
- returns empty array when `universeId` does not exist (queries are filters, not guards)
- does not return resources from other Universes

### Resource-specific scenarios

#### Stat — POST / PATCH

- accepts `appliesTo` with one or more of `minion` | `hero` | `card`
- returns 400 when `appliesTo` is empty
- returns 400 when `appliesTo` contains an unknown entity type

#### Trait — POST / PATCH

- accepts `appliesTo` with one or more of `minion` | `hero` | `card`
- returns 400 when `appliesTo` is empty
- returns 400 when `appliesTo` contains an unknown entity type

#### Card — POST / PATCH

References:

- accepts a `cost` referencing existing Elements of this Universe
- returns 400 when `cost` references an Element not in this Universe
- returns 400 when any `cost` amount is zero or negative
- accepts `factions` referencing existing Factions of this Universe
- returns 400 when `factions` references a Faction not in this Universe

Dictionary references (per [Design-007 — Dictionaries](../design/Design-007_codex-realm.md#dictionaries)):

- returns 400 when `stats` references a Stat not in this Universe
- returns 400 when `traits` references a Trait not in this Universe
- returns 400 when a `stats` slug's `appliesTo` doesn't include `minion` (summon-style cards) or `card` (spell cards)
- returns 400 when a `traits` slug's `appliesTo` doesn't include the entity type the card produces (`minion` for `activation: emptySlot`, `card` otherwise)
- returns 400 when an effect's `giveTraits` / `removeTraits` references a Trait not in this Universe
- returns 400 when an effect's `increaseStat` / `decreaseStat` / `multiplyStat` / `setStat` references a Stat not in this Universe

Activation / stats coupling:

- requires `stats` when `activation` is `emptySlot`
- returns 400 when `stats` is present and `activation` is anything other than `emptySlot`

Abilities — shape:

- accepts an Ability with one or more Effects
- returns 400 when an Ability has an empty `effects` array
- returns 400 when an Ability has neither `trigger` nor `passive: true`
- returns 400 when an Ability has both `trigger` and `passive: true`
- returns 400 when an Ability's `trigger` is not a known Trigger value
- returns 400 when an Ability's `target` is not a known Target slug

Abilities — `chosen` references (per [Design-008 — Activation](../design/Design-008_card-dsl.md#activation)):

- returns 400 when `chosen` (as `target`, in `exclude`, or anywhere in an Expression) appears on a card with `activation: immediate`

Effects:

- returns 400 when an Effect's `kind` is not a registered effect
- returns 400 when an Effect's `params` violate the kind's declared schema
- returns 400 when a `gainElement` param references an Element not in this Universe
- returns 400 when a `summon` effect's `minion` references a Card not in this Universe (or one whose `activation` is not `emptySlot`)

Expressions:

- returns 400 when a dotted-path read uses an unknown root
- returns 400 when a structured operator uses an unknown key
- returns 400 when a structured operator's operand count violates the operator's arity

#### Hero — POST / PATCH

- accepts an `elements` map referencing existing Elements
- returns 400 when `elements` references an Element not in this Universe
- returns 400 when any `elements` amount is negative
- accepts zero or one `faction`
- returns 400 when `faction` references a Faction not in this Universe
- returns 400 when `stats` references a Stat not in this Universe, or one whose `appliesTo` does not include `hero`
- returns 400 when `traits` references a Trait not in this Universe, or one whose `appliesTo` does not include `hero`
- accepts `abilities` with the same shape and validation as Card abilities (passive abilities are typical for hero signatures)
