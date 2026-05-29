# DOD-0029: Lab API and tests

| Field     | Value                                                     |
| --------- | --------------------------------------------------------- |
| Status    | In progress                                               |
| Milestone | [Lab + Engine](../milestones/Milestone-007_lab-engine.md) |
| Created   | 2026-05-29                                                |

## Description

Pin the **Lab** realm HTTP contract — Zod shapes + behavioral spec as `it.todo`. The Lab → Engine interface is pinned in [DOD-0030](./DOD-0030_lab-and-engine-mock.md), not here.

## Resources

Ids are server-generated. Engine-side types (`Battle`, `Action`, `Event`, `Outcome`, `EngineSetup`) come from the engine interface ([DOD-0030](./DOD-0030_lab-and-engine-mock.md)). `CodexContent` is the Codex content snapshot (Cards, Heroes, dictionaries).

```ts
type Character = 'random' | 'greedy' | 'lookahead'

type GuineaPig =                  // value object: character + its params
  | { character: 'random' }
  | { character: 'greedy' }
  | { character: 'lookahead'; depth: number }

interface Protocol {
  id: string
  name?: string
  universeId: string            // engine must be bound
  initialSetup: EngineSetup     // opaque to Lab; hardcoded Hero + deck (MVP)
  sides: [Side, Side]
  turnLimit: number
}

interface Side {
  guineaPig: GuineaPig
  criterionId: string           // resolves within the Protocol's Universe
}

interface Criterion {
  id: string
  universeId: string
  name: string
  weights: Array<{ feature: string; weight: number }>  // non-empty; feature ∈ Universe catalog
}

interface Experiment {
  id: string
  protocolId: string
  trialCount: number            // >= 1
  seed?: string
  status: 'pending' | 'running' | 'done' | 'failed'
  // resolved + frozen at start, for reproducibility:
  protocol: Protocol
  codex: CodexContent
  findings: Findings            // when status === 'done'
  trials: TrialSummary[]
  createdAt: string
  createdBy: string
}

interface Trial {               // read-only
  id: string
  seed: string
  initialState: Battle          // engine-determined from seed
  observations: Observation[]   // sampled — not every Trial is retained
  outcome: Outcome              // engine's { winner, reason }
  turnsPlayed: number
}
type TrialSummary = Pick<Trial, 'id' | 'outcome' | 'turnsPlayed'>

interface Observation {         // one per decision point
  state: Battle                                          // engine: Observe ingredients
  candidates: Array<{ action: Action; score?: number }>  // lab: enumerated; no score for random
  action: Action                                         // lab: the submitted candidate
  events: Event[]                                        // engine: fired during Submit
  scores: Record<CombatantId, number>                    // lab: state scored per Combatant
}
```

**Findings** (computed from Trials) and the **feature catalog** (the Universe's Lab-defined feature names) are read-only.

## Endpoints

```
POST   /v1/protocol
GET    /v1/protocol
GET    /v1/protocol/:id
PATCH  /v1/protocol/:id

POST   /v1/criterion
GET    /v1/criterion?universeId=
GET    /v1/criterion/:id
PATCH  /v1/criterion/:id

GET    /v1/feature?universeId=

POST   /v1/experiment
GET    /v1/experiment?protocolId=
GET    /v1/experiment/:id
GET    /v1/experiment/:id/trial
GET    /v1/experiment/:id/trial/:trialId
```

## Test scenarios (`it.todo`)

- **POST /v1/protocol** — creates; 400 on missing/unresolved `universeId`, Universe has no engine, `sides` ≠ 2, unknown character or bad character params, unresolved/cross-Universe `criterionId`, bad `turnLimit`.
- **PATCH /v1/protocol/:id** — updates `name`/`sides`/`turnLimit`; 404 when missing; POST-equivalent validation.
- **GET /v1/protocol[/:id]** — collection (empty array when none); by id; 404.
- **POST /v1/criterion** — creates; 400 on missing/unresolved `universeId`, bad `name`, empty `weights`, feature not in catalog, non-numeric `weight`.
- **PATCH /v1/criterion/:id** — updates `name`/`weights`; 404; re-validates weights.
- **GET /v1/criterion[/:id]** — filtered by `universeId`; by id; 404.
- **GET /v1/feature** — catalog for a Universe; 400 on missing/unresolved `universeId`.
- **POST /v1/experiment** — creates + starts (`status: pending`); accepts or generates `seed`; snapshots Protocol + Codex; 400 on unresolved `protocolId`, bad `trialCount`.
- **GET /v1/experiment[/:id]** — filtered by `protocolId`; by id incl. `status` and `findings` (when `done`); 404.
- **GET …/trial[/:trialId]** — summaries (`id`, `outcome`, `turnsPlayed`); full log when retained, 404 when not sampled; 404 when Experiment missing.

## References

- [Design-009: Lab Realm](../design/Design-009_lab-realm.md)
