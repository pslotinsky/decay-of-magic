# Design-008: Card DSL

| Field   | Value      |
| ------- | ---------- |
| Created | 2026-04-24 |

## Purpose

Defines the canonical authored shape of cards, abilities, effects, and expressions in the Codex realm — the wire-level grammar for what content authors write and what tooling validates. Sits under [Design-007: Codex Realm](./Design-007_codex-realm.md), which describes the realm itself (entities, dictionaries, value-object roles, runtime contract). This document refines Design-007's value-object level into a concrete, editor-friendly format.

This is the **stored** form: what lives in Codex, what authors edit, what an export bundle contains. The runtime engine is free to convert this on load into any internal representation it likes — see [Engine reads, authors write](#engine-reads-authors-write).

## Position

- **Detailed DSL spec under [Design-007](./Design-007_codex-realm.md).** Design-007 names the realm's entities and value-object roles (Card / Hero / Ability / Trigger / Target / Effect / Expression); this document specifies their concrete grammar. The two should not disagree at the conceptual level — if they do, that is a doc-sync bug, not a winner. Design-007 is authoritative for realm concepts; this document is authoritative for wire-level shape.
- **Supersedes [Research-003](../research/Research-003_spectromancer-dsl.md)**. Research-003 stress-tested an earlier DSL shape against the full Spectromancer card set and surfaced the design questions that this document answers. Retain Research-003 as catalog material; treat its specific JSON shapes as obsolete.
- **Out of scope here**: visual/audio effects (postponed), engine implementation details (covered by the Battle realm), and the **dictionaries** that scope a Universe's stat / trait / element vocabulary. Trait, stat, and element slugs are referenced throughout this document; the concept of per-Universe dictionaries lives in [Design-007 — Dictionaries](./Design-007_codex-realm.md#dictionaries).

## Design principles

1. **UX-first canonical form.** Optimize the shape for content authors and content-editor UIs. Engine convenience is a load-time concern, not a stored-format concern.
2. **Universe-portable engine, universe-specific content.** The engine publishes universe-agnostic primitives (events, expressions, effect functions). Universe vocabulary (stats, traits, elements, damage tags) lives in content-side dictionaries. A new Universe ships new dictionary entries; the engine doesn't change.
3. **Concept follows the designer's mental model.** Passive is a flag, not a magic trigger value. Charge is a trait. Immunity is a trait. Stats include things like growth and defence. The editor reflects the way a designer thinks about a card.
4. **Sugar the common cases; keep full forms for the rare ones.** `exclude: self` is the recurring self-exclusion idiom written as a bare entity reference instead of a structured equality expression. Per-effect filters cover Inferno-style cards without needing cross-effect id references in the common case.
5. **Engine reads, authors write.** Every decision in this document is judged on authoring and presentation UX. The engine compiles to whatever internal form it prefers on content load; that form is not specified here.

## Card prototype

A card prototype is the static template stored in Codex. Instances on the board reference the prototype rather than copying it; the runtime overlay shape is the engine's concern, not part of the authored DSL.

```yaml
# Top-level shape
name: <string>
description: <string>          # rules text and flavor, optional
art: <url>                     # optional, card artwork URL (Vault asset)
factions: [<faction-slug>]     # optional, see Design-007
cost: <Cost>
stats: <Stats>                 # only for cards that summon a minion
traits: [<trait-slug>]         # base traits this card carries
activation: <Activation>       # play-time pick requirement
abilities: [<Ability>]
```

`stats` is present only on cards whose `activation: emptySlot` summons a minion onto the board — those stats become the minion's starting values. Spell cards (`activation` other than `emptySlot`) omit `stats`.

`traits` lists base traits the card carries. For a minion-summoning card, these become the minion's starting traits. For a spell card, these tag the card itself (used for damage source classification).

### Cost

A cost is a map from element slug to amount.

```yaml
cost: { fire: 3 }
cost: { fire: 2, water: 1 }
```

A cost of zero is `cost: {}`.

### Stats

A stat block is a map from stat slug to value. Values may be literals or expressions (see [Expression grammar](#expression-grammar)).

```yaml
stats: { attack: 4, health: 16 }
stats: { attack: ownerHero.elements.fire, health: 37 }    # Fire Elemental
```

Stat slugs must be declared in the Universe's stats dictionary with `appliesTo` including `minion`.

### Traits

```yaml
traits: [wall]
traits: [charge]
traits: [spell]
traits: [immuneToSpells, charge]
```

All slugs must exist in the Universe's traits dictionary. Each slug's `appliesTo` must include the entity type the card produces (`minion` for summon cards, `card` for spells).

### Activation

The card's play-time pick requirement. Determines what (if anything) the player must select before the card resolves.

```yaml
activation: emptySlot | enemyMinion | ownerMinion | immediate
```

Values:

- **`emptySlot`** — player picks an empty board slot on their side. The card summons a minion into that slot. (Goblin Berserker, Wall of Fire, Fire Drake.)
- **`enemyMinion`** — player picks one enemy minion. The picked minion is referenceable from abilities as `chosen`. (Inferno.)
- **`ownerMinion`** — player picks one of their own minions. (Healing-on-ally cards, sacrifice cards.)
- **`immediate`** — no pick. The card resolves as soon as it is played. (Armageddon, Flame Wave, Meditation.)

Within abilities, the picked entity is referenced by the slug `chosen`:

```yaml
target: chosen                                  # the picked entity
filter: { eq: [target, chosen] }                # the picked entity, in a per-effect filter
filter: { ne: [target, chosen] }                # everyone else
```

The card field is named `activation` (it declares the play-time pick pattern); the resolved entity reference inside abilities is named `chosen`. Two names for two concepts: type vs. value.

**Validation**: a card with `activation: immediate` may not reference `chosen` anywhere in its abilities (no entity was picked, so the reference is unresolvable). Caught at content load.

### Abilities

A list of ability nodes. See [Ability shape](#ability-shape).

## Hero prototype

A hero prototype is the static template for a hero — the player-controlled actor that holds the element pools and (optionally) carries an identity-level ability. Heroes are not cards: they are not played from a hand and have no `cost` or `activation`.

```yaml
# Top-level shape
name: <string>
description: <string>          # rules text and flavor, optional
art: <url>                     # optional, hero portrait URL (Vault asset)
faction: <faction-slug>        # optional, see Design-007
elements: <Cost>               # element pool (same shape as cost)
stats: <Stats>                 # hero-only stats (e.g. health, fireGrowth)
traits: [<trait-slug>]         # base traits the hero carries
abilities: [<Ability>]         # signature ability, optional
```

`elements` uses the same map shape as a card's `cost` and seeds the hero's element pools at match start. `stats` lists hero stats only (every slug must be in the stats dictionary with `appliesTo` including `hero`). `traits` lists base traits the hero carries (e.g. `powerGrowthReduced` or universe-specific identity tags).

Abilities on a hero follow the same shape as card abilities. A hero ability typically uses `passive: true` for an always-on signature effect, or a trigger like `onTurnStart` for a recurring one.

## Ability shape

An ability is the unit of "what this card does". An ability has three parts: when it fires, what it sees, what it does.

```yaml
# Ability shape
trigger: <Trigger>     # OR
passive: true          #   (mutually exclusive)
target: <Target>
exclude: <Expression>  # optional, removes entities from the resolved target set
effects: [<Effect>]
```

Exactly one of `trigger` or `passive: true` is present.

`target` selects an entity set; optional `exclude` narrows that set at the ability level; per-effect `filter` (see [Effects](#effects-kind--params--filter)) narrows further for one effect. Authors compose those three to express almost every targeting case.

### Trigger

A trigger names the engine event that fires the ability. Triggers are camelCase, drawn from a small engine-published vocabulary that all Universes share.

```yaml
trigger: onPlay              # card was just played
trigger: onTurnStart         # at start of owner's turn
trigger: onTurnEnd           # at end of owner's turn
trigger: onDeath             # this minion died
trigger: onDamaged           # this entity took damage
trigger: onBeforeDamage      # damage about to be dealt; replacement window
trigger: onAttack            # this minion attacked
trigger: onBeforeAttack      # this minion is about to attack; replacement window
trigger: onSummon            # an ally was summoned
```

Triggers are universe-agnostic. Universe-specific concepts (e.g., "before spell damage") are expressed by combining a generic trigger (`onBeforeDamage`) with a filter on source traits — see [Damage events](#damage-events).

Damage triggers (`onBeforeDamage`, `onDamaged`) fire on the *target* of the damage. The attacker's reactivity uses `onBeforeAttack` / `onAttack` instead — those fire on the source side and are kept distinct from damage-side hooks.

### Passive

`passive: true` marks an ability that is in force while the card is on the board. The engine activates it on enter-board and deactivates it on leave-board. Passive abilities typically apply modifiers; they may also reference other passive state.

Lifecycle:

- **On enter-board** — the target set is resolved, `exclude` is evaluated per candidate, and modifiers apply to surviving candidates.
- **While active** — the target set is reactive: entities entering scope (e.g., a new neighbor) are evaluated against `exclude` and gain the modifier if they pass; entities leaving scope (moved, died, removed) have the modifier reverted. `exclude` is checked when an entity enters scope, not retroactively as that entity's own state evolves.
- **On leave-board** — every modifier the passive applied is reverted.

A `passive` `increaseStat` therefore behaves like a tracked binding, not a one-shot mutation: when the passive deactivates, the bonus disappears. (Permanent stat mutations come from triggered abilities, not passives.)

```yaml
- passive: true
  target: ownerHero
  effects:
    - kind: increaseStat
      params: { spellDamage: 1 }
```

### Target

The set of entities the ability sees. A target is either a bare slug naming the scope, or a non-empty list of slugs whose resolved sets are unioned.

```yaml
target: self
target: ownerHero
target: enemyHero
target: neighbors
target: ownerMinions
target: enemyMinions
target: allMinions          # ownerMinions ∪ enemyMinions
target: chosen              # the play-time pick
target: [enemyHero, enemyMinions]   # all enemies
```

When given a list, each scope is resolved independently and the engine takes the union. Order has no semantic meaning. A single scope may be written as a bare slug or a one-element list — engines treat them identically.

Narrowing happens at two layers, both optional and orthogonal to `target`:

- Ability-level [`exclude`](#exclude) removes entities from the resolved target set before any effect runs.
- Per-effect [`filter`](#effects-kind--params--filter) narrows the set down further for one specific effect.

### Exclude

`exclude` drops entities from the target set at the ability level. It is a sibling of `target` and `effects`, evaluated per candidate.

```yaml
target: neighbors
exclude: self                                          # bare entity reference
```

```yaml
target: neighbors
exclude: { contains: [target.traits, 'wall'] }         # boolean expression
```

A bare entity reference (`self`, `ownerHero`, `chosen`, ...) is sugar for an equality check against the candidate. A structured expression is evaluated per candidate; truthy means drop.

`exclude` and per-effect `filter` are independent: `exclude` shapes the set every effect on this ability sees; `filter` narrows that shaped set for one effect.

### Effects

A list of effect nodes. Each effect is a function call against the engine's effect registry, optionally narrowing the ability's `target` set further.

```yaml
effects:
  - kind: <effect-kind>
    params: <param-map>
    filter: <expression>            # optional, narrows target for this effect
```

See [Effects: kind + params + filter](#effects-kind--params--filter) for the full effect shape.

## Expression grammar

Expressions appear in stats, effect params, exclude predicates, and effect filters. There are exactly two forms — dotted-path reads for property access, and structured operators for everything else. There is no infix operator syntax (`a == b`, `a > b`) and no method-call syntax (`x.contains(y)`); predicates and arithmetic always use the structured form.

### Dotted-path reads

Property access via dotted paths. Roots are well-known scopes; segments traverse the entity's data model.

```yaml
ownerHero.elements.fire           # reads owner hero's fire pool
ownerHero.stats.health            # reads owner hero's current health
target.traits                     # the trait set of the current target
target.stats.attack               # the current target's attack
self.traits                       # the ability owner's traits
chosen                            # the play-time picked entity (reference)
chosen.stats.attack               # picked entity's attack
event.damageDealt                 # event payload field, for triggered abilities
event.source                      # the entity that caused the event
event.source.traits               # traits of the source
```

Roots: `self`, `ownerHero`, `enemyHero`, `target`, `chosen`, `event`.

### Structured operators

Predicates, arithmetic, logic, and membership use structured nodes with a single key naming the operator and a list of operands.

```yaml
# boolean
{ not: <expr> }
{ and: [<expr>, <expr>, ...] }
{ or: [<expr>, <expr>, ...] }

# comparison
{ eq:  [<expr>, <expr>] }
{ ne:  [<expr>, <expr>] }
{ lt:  [<expr>, <expr>] }
{ lte: [<expr>, <expr>] }
{ gt:  [<expr>, <expr>] }
{ gte: [<expr>, <expr>] }

# arithmetic
{ add: [<expr>, <expr>, ...] }
{ sub: [<expr>, <expr>] }
{ mul: [<expr>, <expr>, ...] }
{ div: [<expr>, <expr>] }
{ min: [<expr>, <expr>, ...] }
{ max: [<expr>, <expr>, ...] }

# set / membership
{ contains: [<collection-expr>, <item-expr>] }
```

Operands are themselves expressions: dotted paths, literals, or other operators. Examples:

```yaml
filter: { not: { contains: [target.traits, 'wall'] } }   # neighbors that aren't walls
filter: { gt: [target.stats.health, 10] }                # health above 10
amount:
  add:
    - ownerHero.elements.fire
    - 2
```

A filter (or exclude) is always a boolean expression.

### Literals

Numbers, booleans, and strings are literals. Strings used as collection items (trait slugs, element slugs) are quoted.

```yaml
amount: 5
filter: { eq: [target, chosen] }
filter: { contains: [target.traits, 'charge'] }
```

### Evaluation

All expressions are live-bound. A dotted-path read evaluates against the entity's current state at the moment the engine reads it — `target.stats.attack` in an effect's params reflects the target's attack at effect time, not at card-play time. Stats authored as expressions (e.g. Fire Elemental's `attack: ownerHero.elements.fire`) likewise track their source live. When a snapshot value is needed, write a literal.

## Effects: kind + params + filter

An effect names a function from the engine's effect registry, supplies its arguments, and optionally filters the ability's target set down further for this specific effect.

```yaml
effects:
  - kind: damage
    params: { amount: 5 }

  - kind: damage
    params: { amount: 10 }
    filter: { eq: [target, chosen] }

  - kind: increaseStat
    params: { attack: 2 }
```

### How target and filter interact

The ability resolves a target set (after applying `exclude`, if any). Each effect either:

- Applies to the full set (no `filter` field), or
- Applies to a subset where `filter` evaluates true (per-effect `filter`).

This subsumes the Inferno-style "hit chosen one for X, hit everyone else for Y" pattern without cross-effect id references:

```yaml
# Inferno
activation: enemyMinion
abilities:
  - trigger: onPlay
    target: enemyMinions
    effects:
      - kind: damage
        params: { amount: 10 }
        filter: { eq: [target, chosen] }
      - kind: damage
        params: { amount: 3 }
        filter: { ne: [target, chosen] }
```

### Effect registry

The engine publishes a fixed set of effect functions. Each function declares a param schema; the editor uses the schema to render a per-function form. Universes do not add new effect functions — they add traits, stats, and elements that effect functions reference.

Reference set (universe-agnostic):

| `kind`          | `params`                                             | Purpose                                                                |
|-----------------|------------------------------------------------------|-------------------------------------------------------------------------|
| `damage`        | `{ amount: <expr> }`                                 | Deal damage to each target.                                            |
| `heal`          | `{ amount: <expr> }`                                 | Heal each target.                                                      |
| `fullHeal`      | `{}`                                                 | Restore each target to its base health.                                |
| `gainElement`   | `{ <elementSlug>: <expr>, ... }`                     | Add to each target hero's element pools (negative ok).                 |
| `increaseStat`  | `{ <statSlug>: <expr>, ... }`                        | Add to each target's stat(s).                                          |
| `decreaseStat`  | `{ <statSlug>: <expr>, ... }`                        | Subtract from each target's stat(s).                                   |
| `multiplyStat`  | `{ <statSlug>: <expr>, ... }`                        | Multiply each target's stat(s).                                        |
| `setStat`       | `{ <statSlug>: <expr>, ... }`                        | Set each target's stat(s) to a literal value.                          |
| `giveTraits`    | `{ traits: [<slug>, ...], duration?: <int> }`        | Add traits to each target. Absent duration = permanent.                |
| `removeTraits`  | `{ traits: [<slug>, ...] }`                          | Remove traits from each target.                                        |
| `summon`        | `{ minion: <prototype-ref> }`                        | Summon a minion. Slot grammar TBD; see [Summon slot — TBD](#summon-slot--tbd). |
| `destroy`       | `{}`                                                 | Remove each target from play (no damage event).                        |
| `attackNow`     | `{}`                                                 | Each target attacks immediately, ignoring summoning sickness.          |
| `preventDamage` | `{}`                                                 | Used inside `onBeforeDamage` to cancel the damage event.               |
| `reflectDamage` | `{}`                                                 | Used inside `onBeforeDamage` to redirect damage back at the source.    |

Stat-modification effects (`increaseStat`, `decreaseStat`, `multiplyStat`, `setStat`) accept multi-stat objects so authors can express "+2 attack and +3 health" as one effect node. Each key must be a valid stat slug for the target's entity type.

The param schema is the editor's source of truth. The card editor opens a form per effect with one input per declared param.

### Summon slot — TBD

The `summon` effect's destination slot is deferred to the first concrete card that needs it. Candidate slot expressions to consider when that card surfaces:

- `chosen` — the play-time picked slot (only on cards with `activation: emptySlot`).
- `firstEmptyOwnerSlot` / `firstEmptyEnemySlot` — first vacant slot on a side, in board order.
- `neighborOfSelf` / `neighborOfChosen` — vacant slot adjacent to an entity.

Until a card forces the choice, `summon` ships without a `slot` parameter. Authors writing a summon-from-ability today should flag the use case so the slot grammar can be pinned against a real example rather than speculation.

## Damage events

There is one engine event for damage about to be dealt: **`onBeforeDamage`**. There is no `onBeforeSpellDamage`, `onBeforeAttackDamage`, etc. — those would bake universe-specific damage taxonomies into the engine.

`onBeforeDamage` and `onDamaged` fire on the *target* of the damage. Source-side reactivity (e.g., "when this minion attacks") uses `onBeforeAttack` / `onAttack` instead — those fire on the attacker, not on the damaged entity. Target-side and source-side hooks are deliberately separate so an ability never has to disambiguate which side of a damage event it's reacting to.

The damage event payload includes a **source** reference. The source's traits are accessed via the standard expression grammar:

```yaml
# Ice Golem: immune to spell damage
abilities:
  - trigger: onBeforeDamage
    target: self
    effects:
      - kind: preventDamage
        params: {}
        filter: { contains: [event.source.traits, 'spell'] }
```

The same shape works in any Universe by changing the trait slug:

```yaml
# Robots universe: armor plating, immune to kinetic damage
filter: { contains: [event.source.traits, 'kinetic'] }
```

Damage source taxonomy is content-side. The trait dictionary owns it. The Card prototype's `traits` field is what makes a spell card carry the `spell` trait — that's the same trait dictionary, used at the source side instead of the target side.

## Traits with duration

Traits are added to entities either at instantiation (from the prototype's `traits` field) or at runtime (via the `giveTraits` effect). A runtime-added trait may carry a `duration`.

```yaml
- kind: giveTraits
  params:
    traits: [charge]
    duration: 1                       # ticks down at owner's turn end
```

Semantics:

- `duration` is a positive integer. It counts the number of owner-turn-ends the trait survives.
- A trait without `duration` is permanent — it stays on the entity until explicitly removed.
- "Until X" cases that are not turn-counted (e.g. "until next attack") are not represented as durations. They are modeled as a removal trigger on the granting card or on the recipient:

```yaml
# Hypothetical: "give a minion charge until it attacks"
- trigger: onPlay
  target: ownerMinion
  effects:
    - kind: giveTraits
      params: { traits: [charge] }
- trigger: onAttack
  target: chosen
  effects:
    - kind: removeTraits
      params: { traits: [charge] }
```

This keeps `duration` purely numeric and avoids a special-token vocabulary (`thisTurn`, `untilAttack`, `permanent`). Permanent is "absent". Numeric is integer. Anything else is a removal trigger.

## Worked examples

Each example translates a Spectromancer card from Research-003's catalog into the canonical shape. See Research-003 for the source mechanic descriptions.

### Goblin Berserker · 1·4/16

Minion. At turn start, damages neighboring creatures.

```yaml
name: Goblin Berserker
cost: { fire: 1 }
stats: { attack: 4, health: 16 }
activation: emptySlot
abilities:
  - trigger: onTurnStart
    target: neighbors
    effects:
      - kind: damage
        params: { amount: 2 }
```

### Wall of Fire · 2·0/5

Minion with the `wall` trait. On play, deals 5 damage to each enemy minion. Carries `spell` trait so its damage is spell-typed.

```yaml
name: Wall of Fire
cost: { fire: 2 }
stats: { attack: 0, health: 5 }
traits: [wall, spell]
activation: emptySlot
abilities:
  - trigger: onPlay
    target: enemyMinions
    effects:
      - kind: damage
        params: { amount: 5 }
```

### Fire Drake · 4·4/18

Minion with the `charge` trait. The trait alone expresses "ignores summoning sickness"; no ability needed.

```yaml
name: Fire Drake
cost: { fire: 4 }
stats: { attack: 4, health: 18 }
traits: [charge]
activation: emptySlot
```

### Orc Chieftain · 5·3/17

Minion. Passive: neighboring non-wall creatures get +2 attack.

```yaml
name: Orc Chieftain
cost: { fire: 5 }
stats: { attack: 3, health: 17 }
activation: emptySlot
abilities:
  - passive: true
    target: neighbors
    exclude: { contains: [target.traits, 'wall'] }
    effects:
      - kind: increaseStat
        params: { attack: 2 }
```

### Priest of Fire · 3·3/13

Minion. Passive: +1 fire growth for owner. Modeled by increasing the `fireGrowth` ticking stat on the owner hero.

```yaml
name: Priest of Fire
cost: { fire: 3 }
stats: { attack: 3, health: 13 }
activation: emptySlot
abilities:
  - passive: true
    target: ownerHero
    effects:
      - kind: increaseStat
        params: { fireGrowth: 1 }
```

`fireGrowth` is a hero stat declared in the universe's stats dictionary with `appliesTo: [hero]`. How a `fireGrowth` value feeds the `fire` pool at turn start is the engine's concern; from Codex's perspective, `fireGrowth` is just an ordinary numeric stat.

### Inferno · spell 9

Spell. Player picks an enemy minion. Deals 10 to the picked one, 3 to every other enemy minion.

```yaml
name: Inferno
cost: { fire: 9 }
traits: [spell]
activation: enemyMinion
abilities:
  - trigger: onPlay
    target: enemyMinions
    effects:
      - kind: damage
        params: { amount: 10 }
        filter: { eq: [target, chosen] }
      - kind: damage
        params: { amount: 3 }
        filter: { ne: [target, chosen] }
```

### Armageddon · spell 11

Spell. Plays immediately. Deals damage equal to the caster's Fire pool to the enemy hero and every minion on the board.

```yaml
name: Armageddon
cost: { fire: 11 }
traits: [spell]
activation: immediate
abilities:
  - trigger: onPlay
    target: enemyHero
    effects:
      - kind: damage
        params: { amount: ownerHero.elements.fire }
  - trigger: onPlay
    target: allMinions
    effects:
      - kind: damage
        params: { amount: ownerHero.elements.fire }
```

### Merfolk Overlord · 9·7/35

Minion. On play, grants `charge` to each neighbor.

```yaml
name: Merfolk Overlord
cost: { water: 9 }
stats: { attack: 7, health: 35 }
activation: emptySlot
abilities:
  - trigger: onPlay
    target: neighbors
    effects:
      - kind: giveTraits
        params:
          traits: [charge]
          duration: 1
```

### Ice Golem · 4·4/12

Minion. Immune to spell damage — modeled with the `immuneToSpells` trait, plus a `onBeforeDamage` ability that fires `preventDamage` when the damage source carries the `spell` trait.

```yaml
name: Ice Golem
cost: { water: 4 }
stats: { attack: 4, health: 12 }
traits: [immuneToSpells]
activation: emptySlot
abilities:
  - trigger: onBeforeDamage
    target: self
    effects:
      - kind: preventDamage
        params: {}
        filter: { contains: [event.source.traits, 'spell'] }
```

The `immuneToSpells` trait by itself is descriptive — it carries no engine semantics. The ability is what implements the immunity. (In a future iteration, "named keyword abilities" can collapse this pair into a single trait reference; see [Future work](#future-work).)

### Fire Elemental · 10·?/37

Minion. Attack equals owner's Fire pool. On play, deals fire-pool damage to enemy hero and every enemy minion. Passive: +1 fire growth.

```yaml
name: Fire Elemental
cost: { fire: 10 }
stats:
  attack: ownerHero.elements.fire
  health: 37
activation: emptySlot
abilities:
  - trigger: onPlay
    target: enemyHero
    effects:
      - kind: damage
        params: { amount: ownerHero.elements.fire }
  - trigger: onPlay
    target: enemyMinions
    effects:
      - kind: damage
        params: { amount: ownerHero.elements.fire }
  - passive: true
    target: ownerHero
    effects:
      - kind: increaseStat
        params: { fireGrowth: 1 }
```

## Validation

Validation runs at content load. The editor surfaces these as authoring-time errors.

1. **Dictionary references resolve.**
   - Every trait slug used in `traits`, `giveTraits`, `removeTraits`, or any expression must exist in the Universe's traits dictionary.
   - Every stat slug used in `stats`, `increaseStat`/`decreaseStat`/`multiplyStat`/`setStat`, or any expression must exist in the Universe's stats dictionary.
   - Every element slug used in `cost` or `gainElement` must exist in the Universe's elements dictionary.

2. **Entity-type compatibility.**
   - A trait used on a minion-summoning card must have `appliesTo` including `minion`.
   - A stat used in `stats` (prototype) or in an effect targeting a minion must have `appliesTo` including `minion`. Same for hero, etc.

3. **Chosen references.**
   - `chosen` may appear in expressions and as `target: chosen` only when the card's `activation` field is not `immediate`.

4. **Effect schemas.**
   - Each effect node's `kind` field must name a registered function in the engine's effect registry.
   - The effect's `params` must satisfy the function's declared param schema (required keys present, types correct, etc.).

5. **Expression sanity.**
   - Every dotted path resolves against a known root and a valid attribute chain.
   - Operator arg counts match the operator's arity (`not` takes one, `eq` takes two, etc.).

6. **Mutual exclusion.**
   - An ability has exactly one of `trigger` or `passive: true`.

## Editor implications

The shape is designed so the editor can be built form-first. Sketch:

- **Card form** — cost (per element field), stats (per applicable stat field), traits (multiselect from dictionary), activation (dropdown), description (textarea), abilities (repeating sub-form).
- **Ability form** — trigger picker / passive checkbox (mutually exclusive), target picker (dropdown), optional `exclude` expression input, effects (repeating sub-form).
- **Effect form** — `kind` picker; that kind's param schema drives the rest of the form (numeric inputs, multiselects, expression fields), plus an optional `filter` expression input.
- **Expression input** — dotted-path autocomplete for reads, structured-operator picker UI for predicates and arithmetic. YAML/JSON raw-edit mode available as escape hatch.

Validation runs live in the editor against the Universe's dictionaries. New traits or stats are added in a separate dictionary editor that the card editor consumes.

A draft of this editor should exist from the start, even if it only renders raw YAML — the discipline catches "this shape is awful to author" before it calcifies in content.

## Engine reads, authors write

This document specifies the **stored** form. The engine is free to convert it on load into any internal representation that makes runtime cheap:

- Compile dotted paths to typed accessor functions.
- Compile structured-operator expressions to a tagged AST or a closure.
- Index abilities by trigger event for fast dispatch.
- Pre-resolve effect-kind names to function pointers.
- Cache target-scope resolvers.

None of this is visible to authors. Authors continue to read and write the canonical form. The stored form does not change because the engine got faster.

This separation is also what makes the canonical form portable. Bundles exported from Codex are in the canonical form; a standalone client receiving a bundle compiles it on load without needing the server's runtime structures.

## Out of scope

Deferred. Not a rejection — these likely return as the platform matures.

- **Visual / audio effects.** Cards will eventually attach VFX and SFX payloads to specific effects (per Design-007's BattleEffect / VisualEffect / AudioEffect). For MVP, content runs without presentation; battles can be simulated, logged, and played end-to-end without visuals.
- **Named keyword abilities.** A keyword like `Charge` or `Wall` is currently a trait-plus-ability convention (see Ice Golem). Once duplication hurts, promote keyword + ability bundle to a first-class entity (per Design-007 Out of scope). Until then, copy.
- **Multi-pick activation.** No card in MVP needs the player to pick more than one entity at play time. If a future card does (e.g., "pick two enemies"), `activation` extends to a list-shaped form.
- **Mid-resolution choice.** Some games have "choose one of these effects" cards. Not in scope; would extend the ability shape with a `choose` block.
- **Targeting opponent's choice.** Cards where the *opponent* picks (e.g. "your opponent chooses a creature you control to discard") are not in MVP. Would extend `activation` with a `chooser` field.
- **Versioning.** All Codex content is live (per Design-007 Out of scope). A match in progress is not guaranteed a frozen snapshot of card definitions.

## Future work

- **Keyword abilities as a first-class entity.** Bundle a trait + the ability(ies) that implement it, reference by name on cards. Removes the "trait + same hidden ability copied across cards" duplication.
- **Standard library of universe-level rules** (turn structure, summoning sickness, attack pairing). These are currently Battle-realm concerns; if they surface into Codex, they live in a sibling design doc.
- **DSL versioning.** When the canonical shape evolves past compatibility, content needs a `dslVersion` field and a migration path.
- **Cross-card reference primitives.** Currently abilities operate on entities (self, neighbors, picked target). Cards that reference other cards by name or trait class (e.g., "all your minions with the `beast` trait gain +1 attack") use the trait dictionary already. More elaborate cross-references may want a richer reference grammar.

---

Status: initial draft. Intended to be iterated on as the editor and engine implementations begin to exercise the shape. Significant changes to the canonical form should be tracked here, not scattered across implementation PRs.
