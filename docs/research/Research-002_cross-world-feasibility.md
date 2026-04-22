# Research-002: Cross-world data model feasibility

| Field   | Value      |
| ------- | ---------- |
| Created | 2026-04-22 |

## Purpose

Investigate whether the Codex data model, as shaped in [Design-007](../design/Design-007_codex-realm.md), could support matches or content flowing between different Universes — "cross-world" play. Surface the structural questions, record them for future decision-making.

This is a **speculative investigation**, not a completed study. Cross-world play is explicitly out of scope for MVP. The goal of this document is to map the shape of the problem so that MVP decisions do not accidentally foreclose a future direction.

## Scenarios under consideration

Vague at this stage — product demand has not named any of these as a goal — but representative of what "cross-world" could mean:

- A player plays a Decay-of-Magic Hero in a Cyber Deal match.
- A Decay-of-Magic Card appears as a cameo in a Cyber Deal deck.
- A "crossover" Universe is created that references content from two other Universes.
- Tournament play uses a fixed ruleset with a mixed card pool drawn from multiple Universes.

## What the current model gives us

Two levers from Design-007 matter:

1. **Platform-owned types and Essence natures** — the shared vocabulary. Every Universe speaks the same meta-language: `Element`, `Faction`, `Trait`, `Card`, `Minion`, `Hero`. At a type level, Universes agree on what _kinds of things_ exist.

2. **Universe-owned instances** — each Universe has its own Elements, Factions, Traits, Archetypes. The "Fire" Element in DoM is a different record (with a different id) than the "Fire" Element in Cyber Deal. References across instances are only meaningful within a single Universe.

Cross-world means crossing the boundary in lever 2 while staying inside lever 1.

## Questions to investigate

- **Vocabulary alignment.** A DoM Card with `cost: [{ kind: 'Element', element: <Fire-DoM-id>, amount: 3 }]` plays into a Cyber Deal match. How does the ruleset map `Fire-DoM` to a Cyber Deal Element? Candidates:
  - (a) Named rename rules defined per-pairing.
  - (b) Shared "canonical" Elements that Universes wrap with their own instance.
  - (c) Graceful fallback — unknown element becomes "unpayable" or "free," depending on policy.
- **Archetype compatibility across Universes.** When a DoM Card references a Faction instance absent in the target Universe, what happens? Drop the reference? Refuse to play? Require explicit mapping in match configuration?
- **Ruleset precedence.** Which Universe's ruleset governs a mixed match — the host's, a neutral tournament ruleset, or some merge? (This is partly a Battle concern, but the Codex shape has to support whichever answer wins.)
- **Trait compatibility.** Ability effects referencing Traits (`HasTrait(<Orc-DoM-id>)`) — does a Universe that declares its own unrelated Orc trait share semantics, or stay isolated? Does a shared canonical trait catalog exist above per-Universe traits?
- **Asset resolution.** A Card's `visualEffect.src` resolves against DoM's Vault. Does a cross-world client fetch from multiple Vaults, or does a cross-world match require asset federation?
- **Deterministic replay.** Lab's determinism assumes one snapshot of Codex content per match. A cross-world match references multiple Universes' snapshots; how are they versioned and pinned together?

## What the current data model allows

Nothing in the Design-007 shape _forbids_ cross-world in principle:

- All content is JSON-shaped and reference-typed. Cross-Universe references are data that happens to point outside the authoring Universe.
- Platform-owned vocabulary (`EssenceNature`, `Modifier.attribute`, `Predicate` kinds) is stable across Universes. Cross-world content stays parseable.
- Validation happens at realm boundaries where a ruleset could translate, refuse, or reinterpret cross-world references.

The structural gaps sit at the **rule layer**, not the data layer. Codex can _describe_ mixed content today. What's missing is a "cross-world ruleset" concept: how a match that spans Universes resolves ambiguity and maps references.

## What still needs investigation

- Concrete product scenarios — what does cross-world actually mean for real play?
- Mapping / translation mechanisms between Universe vocabularies.
- Ruleset merge or precedence semantics for mixed matches.
- Asset portability and Vault federation.
- Prior art — how do existing platforms (Hearthstone's Wild/Standard splits, MTG's formats, Duel Masters crossovers) handle something analogous?

## Open until

Product demand for cross-world play is concretely scoped, or a long-term platform direction implicitly commits to it.
