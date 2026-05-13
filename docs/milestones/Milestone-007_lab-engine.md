# Milestone-007: Lab + Engine

| Field   | Value                                |
| ------- | ------------------------------------ |
| Status  | In progress                          |
| Roadmap | [MVP](../roadmaps/Roadmap-01_mvp.md) |
| Created | 2026-05-13                           |

## Goal

Bring up the **Lab** realm and the **Engine** it drives, in parallel. Lab is the first real consumer of the engine API — an AI-driven match simulator that exercises the same step/yield loop a real player would, just with a score-driven heuristic instead of a human.

The engine is structured as a pure state machine that yields at every decision point. Lab supplies an AI player that picks actions by scoring candidates; the engine never knows or cares whether a human or an AI is on the other end.

The engine contract gets pinned in a new design doc (Engine, the successor to [Design-008: Card DSL](../design/Design-008_card-dsl.md)) during Phase 1. The doc stays stack-agnostic per the design-doc convention; the engine implementation itself ships in TypeScript for this milestone, alongside the rest of the platform.

## Scope

The focus is the emulation half of the platform: an engine that can run a match to completion deterministically, and a Lab that can drive it, score outcomes, and surface balance signal.

The milestone is structured in three phases — two drafting phases (intentionally rough, iterating on shape) and one polish phase (hardening edges and adding the cross-match search above the in-match player).

### Phase 1 — Lab + fake engine

Draft implementation and design of both. Pin the engine API contract in the new Engine design doc. Build a deterministic fake engine that returns scripted outcomes, and wire Lab's plumbing — scenario loader, match-runner, result capture, score function v0, greedy action chooser — against that drafted API.

Exit signal: Lab can run a scripted match against the fake engine end-to-end and log each step's chosen action, score delta, and resulting state.

### Phase 2 — Lab + real engine

Replace the fake with a real interpreter of [Design-008: Card DSL](../design/Design-008_card-dsl.md): effect registry, turn structure, passive lifecycle, expression evaluator, targeting. Lab functionality stays draft — batch runs, seed-based replay, and the canonical event log shape land here.

Exit signal: pick 2–3 reference pairings, run thousands of sims, and read out per-turn score curves and win-rate distributions.

### Phase 3 — Polish

Real Lab + real engine. Engine edge cases hardened (replacement-window stacking, passive re-evaluation under topology changes, simultaneous damage). Cross-match strategy search added on top of the in-match player. Council-side view for kicking off batches. Performance headroom for large batches without manual babysitting.

## Why both at once

Lab and Engine co-design. The engine API surfaces are discovered by writing the consumer (Lab) and by running enough simulated matches to find what's awkward. Building either in isolation either over-engineers the engine (without a real consumer to constrain it) or designs Lab against a hypothetical engine. The phased drafting lets both grow at the same cadence, with deliberate polish only after the shape has settled.

## Out of scope

- **Real-time multiplayer.** A networked Battle realm, persistent match state, and human-vs-human play are deferred. The engine API designed here covers the step/yield loop both consumers (Lab and a future Battle) would need, but only Lab is exercised within this milestone.
- **Real-vs-simulated comparison.** Recording real human matches and replaying them through Lab to measure prediction accuracy is a future-milestone goal. The canonical event log shape introduced in Phase 2 keeps the door open for it.
- **Card pool population.** Authoring the full Decay of Magic card set is its own milestone. Phase 2 and 3 work against a small reference set (the worked examples in Design-008).
- **Rust/WASM port of the engine.** Roadmap-01 stage 6 names Rust/WASM as the eventual engine host. Within this milestone the engine ships in TypeScript so it can co-evolve with Lab; a port (and the ADR justifying it) is a future-milestone concern.

## Tasks

<!-- TOC.START: task -->
<!-- TOC.END -->
