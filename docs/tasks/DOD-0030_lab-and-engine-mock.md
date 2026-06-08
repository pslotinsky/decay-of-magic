# DOD-0030: Lab and engine mock

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | Done |
| Milestone | [Lab + Engine](../milestones/Milestone-007_lab-engine.md) |
| Created   | 2026-05-29                                                |

## Description

Build the **Lab** realm on a deterministic **mock** engine, satisfying the [DOD-0029](./DOD-0029_lab-api-and-tests.md) contract.

## Deliverables

**Engine** — `packages/engine`

- Define the engine interface — frozen for DOD-0032 to implement.
- Deterministic mock implementation — scripted results, so Lab runs and is tested before DOD-0032.

**Lab realm** — `realms/lab`

- `lore` (domain)
  - entities: Protocol, Experiment, Trial, Criterion
  - value objects: Findings, Observation, Guinea Pig
  - domain services: scoring, Findings aggregation
  - repository contracts
- `law` (application)
  - Protocol — create, update, read
  - Criterion — create, update, read
  - Experiment — run, read
  - Trial — read
- `ground` (infrastructure) — Prisma repositories
- `frontier` (presentation) — HTTP gates

Feature catalog: hardcoded per Universe for MVP (eventual home: Universe settings).

## References

- [Design-009: Lab Realm](../design/Design-009_lab-realm.md)
- [Design-010: Engine Prototype](../design/Design-010_engine-prototype.md)
