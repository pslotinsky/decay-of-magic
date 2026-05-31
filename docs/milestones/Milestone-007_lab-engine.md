# Milestone-007: Lab + Engine

| Field   | Value                                |
| ------- | ------------------------------------ |
| Status  | In progress                          |
| Roadmap | [MVP](../roadmaps/Roadmap-01_mvp.md) |
| Created | 2026-05-13                           |

## Goal

Bring up the **Lab** realm and the **Engine** it drives — an AI match simulator producing balance signal. Contracts: [Design-009 (Lab)](../design/Design-009_lab-realm.md), [Design-010 (Engine Prototype)](../design/Design-010_engine-prototype.md). Engine ships in TypeScript, interpreting the [Design-008](../design/Design-008_card-dsl.md) DSL.

## Scope

- **Engine** — deterministic match resolution.
- **Lab** — drive the engine, score states, aggregate Findings, surface in Council.
- Built Lab-first against a mock, then the real engine swapped in.

## Out of scope

- Real-time / networked human play (future Battle realm).
- Real-vs-simulated match comparison.
- Full DoM card-set authoring (reference set only).
- Rust/WASM engine port (Roadmap-01 stage 6).

<!-- TOC.START: task -->
- [x] [DOD-0029: Lab API and tests](../tasks/DOD-0029_lab-api-and-tests.md)
- [ ] [DOD-0030: Lab and engine mock](../tasks/DOD-0030_lab-and-engine-mock.md)
- [ ] [DOD-0031: Lab UI](../tasks/DOD-0031_lab-ui.md)
- [ ] [DOD-0032: Engine prototype](../tasks/DOD-0032_engine-prototype.md)
<!-- TOC.END -->
