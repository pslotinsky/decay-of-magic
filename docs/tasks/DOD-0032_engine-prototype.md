# DOD-0032: Engine prototype

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | In progress                                               |
| Milestone | [Lab + Engine](../milestones/Milestone-007_lab-engine.md) |
| Created   | 2026-05-29                                                |

## Description

Implement the real **BattleEngine** — a drop-in for the [DOD-0030](./DOD-0030_lab-and-engine-mock.md) mock against the same interface. Interprets the card DSL.

## Deliverables

- Operations: `Construct` / `Observe` / `Submit` / `Peek`
- Ability resolution pipeline (target → exclude → effects)
- Targeting keywords
- Effect registry (15 kinds)
- Expression evaluator
- Damage pipeline
- Events + facet dispatch + listener
- Turn-flow sub-sequences (turn / play / summon / damage / death / turn-end / auto-attack)
- Passives: recompute-on-read + fold order
- Determinism: seeded RNG, fixed iteration order, byte-identical replay
- Ruleset consumed at Construct
- Reserved no-ops: `setStat`, `removeTraits`, non-stat passives

## Hardening (Phase-3)

- Simultaneous terminals → Ruleset tie-break
- Passive re-eval under board changes
- Replacement-window stacking
- Pin open semantics (`killedCount`, `health` vs effective-stats, Peek/listener, Death order)
- Large-batch performance

## References

- [Design-010: Engine Prototype](../design/Design-010_engine-prototype.md)
- [Design-008: Card DSL](../design/Design-008_card-dsl.md)
