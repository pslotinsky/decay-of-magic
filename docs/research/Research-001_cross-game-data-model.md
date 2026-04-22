# Research-001: Cross-game data model fit

| Field   | Value      |
| ------- | ---------- |
| Created | 2026-04-22 |

## Purpose

Stress-test the Codex data model against a set of existing digital card games to validate that the shape is expressive enough, surface architectural gaps, and separate what the DSL can represent from what the Battle engine would need to implement.

The headline finding, developed through this research, is that **Codex's DSL is engine-agnostic**. It describes what content *is* and what it *does*; how an engine *resolves* those "do"s is not a content concern. This reframes most earlier "model-breakers" as engine work, not data-shape problems.

Captured as a point-in-time snapshot: the findings inform the shape captured in [Design-007](../design/Design-007_codex-realm.md) and are preserved so future readers can see _why_ the DSL looks the way it does.

## Games analyzed

- **Spectromancer** — slot-based magic duel with a per-school "power" resource that grows over time.
- **Berserk** (Hobby World) — hex-based tactical CCG.
- **Urban Rivals** — simultaneous-round character clash with Pillz bidding, no summoning.
- **Faeria** — hex-grid card/board hybrid where land placement is a core mechanic.
- **Duelyst** — 9×5 grid with Generals that move and attack physically on the board.

**Astral Masters** was in scope but network access was unavailable at research time; Spectromancer findings generalize.

## The engine-agnostic principle

The key insight from this research: **the DSL binds to an engine-published vocabulary, not to a specific game.**

Codex content describes:

- **Identity** — what this entity is (Card, Minion, Hero, or a platform-extensible kind like Equipment, Land, Artifact).
- **Cost** — what resources/currencies the action consumes.
- **Stats** — numerical attributes, expressed as `NumericExpr` for static or computed values.
- **Triggers** — which engine events fire its behavior.
- **Effects** — what engine functions it invokes.
- **Targets** — which engine-defined selectors it applies to.
- **Modifiers** — which engine-defined attributes it modifies, and how.
- **Predicates** — filters expressed against engine-defined queryable facts.

Each of these is **parameterized by the engine**. The engine publishes its vocabulary — the events it fires, the selectors it resolves, the effect functions it executes, the modifier attributes it honors, the cost components it understands, the essence kinds it supports. Codex content invokes that vocabulary.

**Consequence: the same Codex can hold content for any engine.** A slot-based duel, a hex wargame, a Pillz-bid character clash, a hex-land placement game — all describable in the same DSL as long as each game's engine publishes its own vocabulary.

The things that looked like "model-breakers" in earlier drafts of this analysis — Pillz bidding, hex geometry, simultaneous clash resolution, Artifact durability — are **engine implementations**, not Codex shape gaps. Codex stores the data describing content behavior; the engine decides what that behavior means at runtime.

## Coverage at a glance

Under the engine-agnostic framing, per-game coverage is not a DSL property — it's a function of how much engine work is needed to enable the vocabulary for that game.

| Game          | Content describable in Codex? | Gated on                                                                                             |
| ------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| Spectromancer | ~100%                         | Engine registers `elementPower`, `min`, `CardsPerTurn`, `AttacksPerTurn`, `SpellCost` vocabulary     |
| Berserk       | ~100%                         | Engine registers hex selectors, movement effect, `terrain` kind, `OnEquipped`, initiative attributes |
| Urban Rivals  | ~100%                         | Engine registers `Pillz` cost, round-phase events, `AbilityEnabled`, `attributeOf`                   |
| Faeria        | ~100% (minus deck rules)      | Engine registers `land` kind, hex adjacency predicates, tile occupancy triggers                      |
| Duelyst       | ~100%                         | Engine registers positional selectors, `artifact` kind, `MustAttack`, `RearOf`                       |

The only genuine outlier is Faeria's **deckbuilding color thresholds** — a deck-validation rule outside per-match content entirely. That belongs to deck rules, not Codex or Battle.

## Features by game — engine vocabulary to publish

Reframed from earlier drafts: most entries are **engine vocabulary additions** the engine registers to enable describing that game's content. Each row is something the engine publishes to its function/kind/attribute registry so Codex content can invoke it.

| Game          | Feature                                                            | Engine publishes                                                              |
| ------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Spectromancer | Damage from school power (_Oracle_)                                | `elementPower` NumericExpr kind                                               |
| Spectromancer | Clamped damage (_Greater Demon_: Fire power, max 10)               | `min` NumericExpr kind                                                        |
| Spectromancer | Heal from event count (_Drain Souls_: heal = 2× creatures killed)  | `eventValue` NumericExpr kind with event `killedCount`                        |
| Spectromancer | Full heal (_Archangel_)                                            | `fullHeal` effect function                                                    |
| Spectromancer | Extra card play per turn (_Timeweaver_)                            | `CardsPerTurn` modifier attribute                                             |
| Spectromancer | Extra attack per turn (_Monument to Rage_)                         | `AttacksPerTurn` modifier attribute                                           |
| Spectromancer | Spell cost modifier (_Timeweaver_)                                 | `SpellCost` modifier attribute                                                |
| Spectromancer | Stat from count (_Golem Instructor_)                               | `count` NumericExpr kind; `AllAllies` selector                                |
| Spectromancer | Conditional target ("enemies with cost < X")                       | Selector filter + comparator predicate                                        |
| Spectromancer | Replace on death (_Lemure_ → _Scrambled Lemure_)                   | `SameSlot` selector                                                           |
| Berserk       | Hex targeting / facing / LOS                                       | `HexAt(q,r)`, `HexesInRange(n)`, `HexLine(dir,len)` selectors                 |
| Berserk       | Movement as action                                                 | `moveTo` effect function; turn-phase events                                   |
| Berserk       | Terrain / obstacle cards                                           | `terrain` essence kind                                                        |
| Berserk       | Initiative ordering                                                | `Initiative` attribute; `OnInitiativePhase` event                             |
| Berserk       | Range / movement stats                                             | `MovementRange`, `AttackRange` attributes                                     |
| Berserk       | Squad summon (multi-token)                                         | `count` param on summon function; summon-pattern param                        |
| Berserk       | Equipment                                                          | `equipment` essence kind; `OnEquipped` event                                  |
| Urban Rivals  | Pillz bidding                                                      | `Pillz` cost component; round-bid events                                      |
| Urban Rivals  | Hand-based Leader effects (_Ambre_)                                | `OwnHand` selector; Passive modifier over hand                                |
| Urban Rivals  | Round-phase triggers (_Revenge_, _Defeat_, _Confidence_)           | `OnRoundStart`, `OnWinRound`, `OnLoseRound`, `OnSelectedForRound`             |
| Urban Rivals  | Stats scale with round / same-clan allies                          | `eventValue("roundNumber")`; `count(HasFaction(X))`                           |
| Urban Rivals  | Copy opponent's attribute (_Uranus_-style)                         | `attributeOf` NumericExpr kind                                                |
| Urban Rivals  | Stat floor/ceiling ("Damage −3 min 2")                             | `max` / `min` NumericExpr kinds                                               |
| Urban Rivals  | Stop Opp Ability / Protection                                      | `AbilityEnabled`, `BonusEnabled` modifier attributes                          |
| Faeria        | Hex adjacency for summon (summon on Lake)                          | `adjacentLand(type)` predicate; summon-legality hook                          |
| Faeria        | Land cards                                                         | `land` essence kind; engine owns tile placement                               |
| Faeria        | Deckbuilding color thresholds                                      | Outside Codex — deck-validation concern                                       |
| Faeria        | Resource tiles (_Faeria wells_)                                    | Tile entity with `OnTurnStart` + `gainElement`                                |
| Faeria        | Ranged attacks / Jump                                              | `AttackRange`, `MovementMode` attributes                                      |
| Duelyst       | 9×5 coordinate grid                                                | Coordinate-aware selectors                                                    |
| Duelyst       | General as movable Hero-on-grid                                    | `position`, `movement`, `attack` attributes on Hero                           |
| Duelyst       | Artifacts (equipment with durability)                              | `artifact` essence kind; payload `durability: NumericExpr`                    |
| Duelyst       | Mana-spring tiles                                                  | Tile entity with `OnEvent(GeneralEntersTile)` trigger                         |
| Duelyst       | Provoke                                                            | `MustAttack`, `CanMove` modifier attributes                                   |
| Duelyst       | Zeal (near own General)                                            | `NearGeneral` scope extension                                                 |
| Duelyst       | Backstab                                                           | `OnBackstab` event; `RearOf` selector                                         |
| Duelyst       | Replace (discard to draw)                                          | `replace` effect function; `Discard` cost component                           |
| Duelyst       | "Damage = count of Provoke minions"                                | `count` + `hasKeyword` predicate                                              |

## DSL framings: algebraic vs RPC

The shape decisions for the DSL are engine-agnostic in either of two framings. Both describe the same content; both are shape-stable and extensible. They differ in *how* nodes are typed and composed.

### Algebraic framing (currently proposed)

Every node is a tagged union member with a type-specific payload. Separate type hierarchies for each category: `BattleEffect`, `NumericExpr`, `Predicate`, `Selector`, `Trigger`, `CostComponent`, `Ability`, `Modifier`. Each hierarchy has its own discriminated sum, and payloads are typed per variant.

### RPC framing (alternative)

Every node is a function invocation `{ fn, args }` against an engine-published function registry. Effects, expressions, selectors, predicates, and triggers all share the same shape — they differ only in the registered function's return-type category (void for effects, value for expressions, boolean for predicates, target-set for selectors).

The engine publishes a registry analogous to MCP tools: each function has a name, a JSON Schema for args, a return-type category, and an implementation. Codex stores invocations; the engine resolves them.

## Examples — both framings side by side

Same content under each framing. Elements, Minions, Traits referenced by id; names inline for readability.

### Oracle — damage from school power

> Spectromancer. *"At the beginning of its owner's turn, Oracle deals damage to the opponent equal to its owner's Illusion power."*

**Algebraic:**

```
abilities: [{
  kind: "Triggered",
  trigger: { kind: "OnTurnStart" },
  target: { selector: { kind: "EnemyHero" } },
  effects: [{
    kind: "Damage",
    amount: { kind: "ElementPower", element: "<Illusion>", owner: "self" }
  }]
}]
```

**RPC:**

```
abilities: [{
  on: "turnStart",
  call: "damage",
  args: {
    target: { fn: "enemyHero" },
    amount: { fn: "elementPower", args: { element: "<Illusion>", owner: "self" } }
  }
}]
```

### Timeweaver — passive cost reduction

> Spectromancer. *"Decreases the cost of its owner's spells by 1."*

**Algebraic:**

```
{
  kind: "Passive",
  modifier: {
    scope: { kind: "AllAllies" },
    attribute: "SpellCost",
    operator: "Add",
    value: { kind: "Literal", value: -1 }
  }
}
```

**RPC:**

```
{
  passive: true,
  scope: { fn: "allAllies" },
  modify: "SpellCost",
  op: "add",
  value: -1
}
```

### Provoke — passive restricting enemy actions

> Duelyst. *"Enemy minions in neighboring tiles must attack this minion and cannot move."*

**Algebraic:**

```
abilities: [
  {
    kind: "Passive",
    modifier: {
      scope:  { selector: { kind: "NeighborSlots" }, filter: { kind: "HasTrait", trait: "<Enemy>" } },
      attribute: "MustAttack",
      operator:  "Set",
      value:     { kind: "SelfRef" }
    }
  },
  {
    kind: "Passive",
    modifier: {
      scope:  { selector: { kind: "NeighborSlots" }, filter: { kind: "HasTrait", trait: "<Enemy>" } },
      attribute: "CanMove",
      operator:  "Set",
      value:     false
    }
  }
]
```

**RPC:**

```
abilities: [
  {
    passive: true,
    scope: { fn: "neighborSlots", filter: { fn: "hasTrait", args: { trait: "<Enemy>" } } },
    modify: "MustAttack",
    op: "set",
    value: { fn: "selfRef" }
  },
  {
    passive: true,
    scope: { fn: "neighborSlots", filter: { fn: "hasTrait", args: { trait: "<Enemy>" } } },
    modify: "CanMove",
    op: "set",
    value: false
  }
]
```

## Approach comparison

Both framings handle ~100% of the surveyed games' content under the engine-agnostic principle. Both are shape-stable and support additive extension. The choice is about ergonomics and operational philosophy.

### Algebraic

**Pros:**

- **Type-specific at every node.** Different node categories (BattleEffect vs NumericExpr vs Predicate vs Selector) carry different typed payloads. IDE tooling, static checking, and Zod discriminated-union validation benefit.
- **First-class catalog types.** Vocabulary registers (BattleEffect kinds, NumericExpr kinds, etc.) are visible as types; consumers can enumerate and introspect them directly.
- **Council authoring UX is type-aware.** A "Damage effect" form has a typed "amount" slot that specifically accepts a NumericExpr — the UI knows this from the type.
- **Natural match for TypeScript + Zod.** Discriminated unions map cleanly; generated types are expressive.

**Cons:**

- **Rigid with multiple registries.** Adding new kinds means updating each relevant sum type across schemas, domain types, and any generated bindings.
- **Many concepts to learn.** BattleEffect, NumericExpr, Predicate, Selector, Trigger, CostComponent, Ability, Modifier — each with its own vocabulary catalog.
- **Engine-vocabulary publishing requires schema updates.** Publishing a new modifier attribute or effect kind is coordinated with contract updates.

### RPC

**Pros:**

- **One shape everywhere.** Any node is `{ fn, args }`. Minimal schema; trivial to parse and serialize.
- **Frictionless extensibility.** Engine adds a function + its arg schema; Codex stores invocations. No type updates in Codex itself.
- **MCP-aligned.** Same mental model as AI tool-calling protocols. If the platform ever wants AI-authored content, the shape is already protocol-shaped for it.
- **Plugin-friendly.** A Universe-specific engine could register Universe-specific functions without Codex schema changes — the shape absorbs them.
- **Authoring UX is generative.** Council renders forms from the engine's published arg schemas, like MCP clients render tool-call forms. Adding a new function gets a form for free.

**Cons:**

- **Looser typing at the contract level.** Codex validates each invocation against that function's schema rather than against a higher-level type graph. Static tools see less structure.
- **Nested invocations are verbose.** `{fn: "min", args: {items: [{fn: "elementPower", args: {...}}, {fn: "literal", args: {value: 10}}]}}` versus the algebraic form. Readable, but wordier.
- **"Effect vs expression vs predicate" becomes convention, not type.** Category is implicit in the function's return-type declaration. Requires discipline; less compile-time protection against category confusion.
- **Requires a function registry as infrastructure.** The registry becomes a first-class runtime artifact — schemas, versions, discovery. More moving parts than a static type graph.

### Where they converge

Under the hood, both serialize to similar JSON. Both are engine-agnostic. Both support:

- Shape-stable extensibility — new variants / new functions are additive.
- Engine vocabulary publishing — a registry of valid kinds / functions.
- Computed values via expression trees.
- Jsonb storage in the same schema.

**Migration between them is a rename refactor**: `kind` ↔ `fn`, variant payload ↔ `args`, unifying nested type hierarchies under `{fn, args}`. Existing content survives the move because the structural data is equivalent.

## Decisions adopted from this research

Shape decisions locked (under the algebraic framing) informed directly by this analysis:

- Tagged-union shape for every sum type (`Selector`, `Trigger`, `Ability`, `BattleEffect`, `CostComponent`, `NumericExpr`, `Predicate`) — future variants are pure additions.
- `NumericExpr` tree everywhere scalars appear — never raw integers.
- Open enums for `Essence` nature and `Modifier.attribute` — platform-extensible, not fixed.
- `NumericExpr.AttributeOf(target, attribute)` — referenced by ≥3 of the surveyed games.
- `Predicate.HasTrait` — referenced by 4 of 5; subsumes HasKeyword/HasRace/HasType.
- `Trait` as a platform entity type — absorbs keyword/race/type-style per-Universe tag systems.
- Platform-vs-Universe boundary — types and Essence natures are platform-owned, instances are Universe-owned.

Conceptual principle newly elevated by this research:

- **Codex is engine-agnostic.** The DSL describes content as invocations against an engine-published vocabulary. Different engines publish different vocabularies; the DSL shape is the same. This should be the framing spine of Design-007.

## Final summary

### What the research showed

The DSL, as currently shaped (tagged-union algebraic form), can describe ~100% of content across all five surveyed games, including Urban Rivals — **provided the engine for that game publishes its vocabulary**. Apparent limits like hex geometry, simultaneous clash, and Pillz bidding are engine-implementation work, not DSL shape gaps.

The only content concept that genuinely lies outside Codex is **deckbuilding color-threshold rules** (Faeria). That's a deck-validation layer, not match content.

### Between algebraic and RPC framings

Both are viable and describe the same content.

- **Algebraic** is stricter, type-safer, and matches our TypeScript + Zod stack most naturally. Designer UX benefits from type-aware renderers.
- **RPC** is simpler conceptually, more extensible, and aligned with MCP-style protocols. Scales better as engine vocabularies grow. Less type-specific at the contract layer.

### Recommendation

**Start with the algebraic shape for MVP.** It's stricter, gives more compile-time guarantees, matches Zod + TypeScript cleanly, and works with our existing api-contract pattern.

**Write Design-007 with the engine-agnostic principle as the spine.** That's the larger conceptual shift — making explicit that the DSL parameterizes against engine-published vocabulary. It gets most of the conceptual benefit without committing to a shape change.

**Keep the RPC framing documented as an alternative.** Migrating to RPC later is a rename refactor — the content survives the move. If we find the algebraic shape gets unwieldy as the vocabulary grows, or if MCP-alignment becomes operationally valuable (e.g., AI-authored content), we can pivot.

### Verdict on coverage

If we adopt the engine-agnostic principle and implement the algebraic DSL as planned:

- **Codex MVP** ships with a DSL that can describe content for any future engine that publishes its vocabulary — **not just Decay of Magic.**
- **Content describable**: ~100% across the surveyed games (minus deck rules).
- **Engine work required**: proportional to how different the engine is from slot-based turn play. DoM needs none beyond MVP; grid games need geometry; simultaneous-clash games need paradigm-specific resolution logic. None of this is Codex work.

## Caveats

- Four of five per-game reports were produced by subagents working from prior training-data knowledge rather than live pages; network access was unavailable at research time. Card names and stats cited should be verified against current live sources before being quoted in any public-facing material.
- The "%" figures are qualitative estimates, not measured. They reflect the researcher's judgment after scanning representative card sets, not a systematic audit.
