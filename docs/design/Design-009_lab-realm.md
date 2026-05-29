# Design-009: Lab Realm

| Field   | Value      |
| ------- | ---------- |
| Created | 2026-05-13 |

## Description

Lab is the platform's simulation realm. It emulates matches against a deterministic engine to produce balance signal — win rates, score trajectories, per-Card frequency, Guinea Pig comparisons.

Lab is the first real consumer of the engine API. It drives the same Observe / Submit loop a human player would, with a Guinea Pig supplying actions instead of a human. The engine is policy-free; Battle (future) and Lab (now) share one API.

Lab consumes Codex (Universe content snapshotted at experiment start) and the engine (one session per Trial; engine resolved per Universe). Council renders Lab's read API. Human play is Battle's concern, not Lab's.

```mermaid
flowchart LR
    Designer((Designer))
    Council[Council]
    Lab[Lab]
    Codex[(Codex)]
    Engine[Engine]

    Designer -->|drives| Council
    Council -->|reads / writes| Lab
    Lab -->|reads| Codex
    Lab -->|drives| Engine
```

## Glossary

| Term | What it is |
|---|---|
| **Protocol** | Reusable specification of what to test (entity) |
| **Experiment** | One conducted batch of Trials (entity) |
| **Trial** | One simulated game within an Experiment (entity) |
| **Criterion** | Named weighted feature set for scoring states (entity) |
| **Findings** | Aggregated conclusions of an Experiment (value object) |
| **Observation** | Per-decision-point record within a Trial (value object) |
| **Guinea Pig** | A configured player used inside Trials — a character plus its params (value object) |
| **Character** | An action-selection strategy a Guinea Pig plays with (code module) |

## Functionality

Lab's MVP capabilities. Each maps to one or more use cases.

- **Run one trial.** Emulate a complete trial end-to-end from a Protocol (Heroes, decks, Guinea Pig per side). Produces a Trial record — the observation log (each entry carrying its engine event delta) plus the outcome.
- **Run a batch.** Repeat single-trial emulation N times with fresh seeds against the same Protocol. Produces an Experiment containing N Trials and aggregated Findings.
- **Compare.** A batch variant: hold most of a Protocol constant, vary one axis per side — Guinea Pig, Criterion, or both. Used to compare Guinea Pigs and to research which Criterion best models a Universe. Produces Findings stratified by the axis that varied.
- **Inspect a Trial.** Read a Trial's full observation log — every decision point, the action chosen, the alternatives considered with their scores, the engine event delta, the resulting score delta. Surfaces *critical moments* (largest score swings) so a designer can find a trial's turning point without scrolling the whole log.
- **Inspect an Experiment.** Read an Experiment's aggregated Findings — win rate per side (and per Guinea Pig if applicable), trial-length distribution, per-turn score trajectories with confidence bands, per-Card frequency, per-Card win-when-played correlation, termination-reason breakdown.
- **Define scoring.** Create, edit, clone Criteria per Universe. Each is a named weighted feature set that Guinea Pigs consult when evaluating candidate states. The other half of emulation configuration — rules — is inherited from the Universe in MVP (not per-Protocol tunable; see [Out of scope](#out-of-scope)).

## Use cases

### Single-trial emulation

A designer wants to inspect one trial end-to-end — see every decision the AI made, the alternatives it considered, and the state transitions that followed.

```mermaid
sequenceDiagram
    actor Designer
    participant Council
    participant Lab
    participant Codex
    participant Engine

    Designer->>Council: Configure Protocol (heroes, decks, guinea pigs, scoring)
    Council->>Lab: POST protocol, start experiment (seed?)
    Lab->>Codex: Load Universe content snapshot
    Codex-->>Lab: Cards, Heroes, dictionaries
    Lab->>Engine: Construct(snapshot, initial state, seed, onEvent)
    loop until Outcome set
        Lab->>Engine: Observe
        Engine-->>Lab: Decision point (state, playable cards, targets)
        Lab->>Lab: GuineaPig.pickAction(state, legalActions)
        Lab->>Engine: Submit chosen action
        Note over Lab,Engine: Submit fires Events to onEvent;<br/>Lab buffers them as the Observation's event delta
    end
    Engine-->>Lab: Outcome (winner, reason)
    Lab->>Lab: Build Trial record (observations, outcome)
    Lab-->>Council: Trial record
    Council-->>Designer: Render trajectory + log
```

### Batch experiment (balance sweep)

A designer wants aggregate signal over many trials — "is this pairing balanced?", "does Card X dominate?".

```mermaid
sequenceDiagram
    actor Designer
    participant Council
    participant Lab
    participant Engine

    Designer->>Council: Configure Protocol
    Council->>Lab: POST protocol, start experiment (trialCount=1000)
    loop N trials
        Lab->>Engine: Construct (fresh seed per trial)
        Note over Lab,Engine: Same Observe / Submit loop as single trial
        Engine-->>Lab: Outcome
        Lab->>Lab: Append outcome
    end
    Lab->>Lab: Aggregate (win rate, distributions, curves)
    Lab-->>Council: Findings
    Council-->>Designer: Visualization (charts, tables)
```

### Comparison

A designer wants to compare two variants of one axis — two Guinea Pigs (which plays better?), two Criteria (which scoring better models the Universe?), or a (Guinea Pig, Criterion) pair on each side. Everything else in the Protocol is held constant.

```mermaid
sequenceDiagram
    actor Designer
    participant Council
    participant Lab
    participant Engine

    Designer->>Council: Same heroes/decks, variant A vs variant B
    Note over Designer,Council: variant = Guinea Pig or Criterion or both
    Council->>Lab: POST protocol
    loop N trials
        Lab->>Engine: Construct
        Note over Lab: Side A runs variant A,<br/>side B runs variant B
        Engine-->>Lab: Outcome
    end
    Lab-->>Council: Aggregate stratified by variant
    Council-->>Designer: Win rate per variant + score curves
```

### Define scoring

A designer creates or refines a Criterion. Used to research how a Universe should be scored, and as preparation for comparison experiments.

```mermaid
sequenceDiagram
    actor Designer
    participant Council
    participant Lab

    Designer->>Council: Open Criteria for Universe
    Council->>Lab: GET Criteria (filtered by Universe)
    Lab-->>Council: Existing list
    Designer->>Council: Clone, edit weights, save
    Council->>Lab: POST new Criterion (name, weights, universe)
    Lab-->>Council: Saved
    Council-->>Designer: Visible in Protocol picker
```

## Entities

Lab's domain is small: four entities and two value objects. Codex provides the per-Universe content the engine consumes; Lab references it by id but does not redefine it.

### Protocol

The input to an experiment. A reusable specification of what to test. Carries:

- a **Universe** reference — resolves Codex content and the engine that drives the trial,
- an **initial setup** — the per-side starting data the engine consumes. The shape is engine-defined and varies by Universe. For the MVP universes this is a Hero plus a deck of Cards per side, validated against Codex; other Universes may have no Heroes, no Cards, asymmetric setups, or pools instead of decks. Lab treats it as engine-validated payload rather than a fixed schema.
- a **Guinea Pig** per side — a value object pairing a character (`random`, `greedy`, `lookahead`, …) with its params,
- a **Criterion** reference per side — the weighted feature set the Guinea Pig consults,
- **turnLimit** — operational guard that caps runaway trials.

The (Guinea Pig, Criterion) pair is independent per side: identical across sides for normal experiments, divergent for Comparison experiments.

Sample-size (`trialCount`) and the random instance (`seed`) live on the **Experiment**, not the Protocol — a Protocol describes *what to test*, not *how thoroughly* or *which random instance*. Running the same Protocol with `trialCount=100` then `trialCount=10000` produces two Experiments, not two Protocols.

### Experiment

One execution of a Protocol. The historical record of a batch of simulations (a single trial is just a batch of size 1). Carries:

- a **resolved Protocol snapshot** — the Protocol's contents captured at experiment start, so later Protocol edits don't retroactively change history,
- a **Codex content snapshot** — Cards, Heroes, dictionaries as they existed when the Experiment started (Codex is live; this snapshot is what makes an Experiment reproducible),
- **trialCount** — how many Trials this Experiment runs (1 for a single-trial Experiment, N for a batch),
- a **seed** — the base seed for this Experiment; supplied by the designer or generated by Lab. Per-Trial seeds derive from it deterministically, so re-running with the same base seed reproduces the same Trial sequence.
- a list of **Trial** results,
- the **Findings** value object,
- timestamps and the user that started it.

### Trial

One simulated game inside an Experiment. Carries:

- the **per-trial seed**,
- the **initial state** — deck order, starting hands, board layout (engine-determined from the seed),
- the **observation log** — an ordered list of **Observation** entries, one per decision point (each carrying its engine event delta, so the trial's event stream is the deltas in order — no separate log),
- the **outcome** — the engine's Outcome (`winner`, `reason`), set when the Battle ends,
- **turns played** — a recorded length metric feeding the trial-length distribution.

### Criterion

A named weighted feature set used by Guinea Pigs to evaluate trial states. Universe-scoped: each Universe has its own feature catalog (since "what's worth tracking" differs by game), and a Criterion picks weights over that catalog. Carries:

- a **Universe** reference,
- a **name**,
- a list of **(feature, weight)** pairs — each feature must exist in the Universe's feature catalog.

Multiple Criteria can coexist for the same Universe. Criteria are mutable — an Experiment captures the resolved weights in its snapshot, so later edits don't change past Experiment results. Designers preserve historical weights by **cloning** a Criterion before editing it.

### Findings

Value object owned by an Experiment. Computed from the Experiment's Trials; not edited directly. Carries:

- win rate per side (and per Guinea Pig / Criterion in a Comparison),
- trial-length distribution,
- per-turn score trajectories with confidence bands,
- per-Card play frequency and per-Card win-when-played correlation,
- termination-reason breakdown.

### Observation

Value object owned by a Trial — one entry per decision point. Carries:

- the **decision point** — the observed state and the legal actions presented,
- the **chosen action**,
- the **alternatives considered** with the score each would have produced,
- the **engine event delta** that followed submitting the chosen action,
- the **score delta** between the prior and resulting states.

### Domain model

```mermaid
classDiagram
    class Protocol {
        <<entity>>
    }
    class Experiment {
        <<entity>>
    }
    class Trial {
        <<entity>>
    }
    class Criterion {
        <<entity>>
    }
    class Findings {
        <<value object>>
    }
    class Observation {
        <<value object>>
    }

    Protocol --> "2" Criterion : per side

    Experiment *-- "*" Trial
    Experiment *-- "1" Findings
    Experiment ..> Protocol : snapshot of

    Trial *-- "*" Observation
    Trial ..> Criterion : per side at experiment time
```

## Engine contract

What Lab requires from the engine. The authoritative contract lives in the forthcoming Engine design doc; this section captures Lab's view.

### Operations

One engine instance = one Trial. Lab constructs N instances for a batch, each fully isolated; no explicit session handle is passed because the instance *is* the session.

| Operation | Purpose |
|---|---|
| `Construct(snapshot, initialSetup, seed, onEvent?)` | Construct an engine, register an optional event listener, and advance to the first decision point. Returns the engine (or a set Outcome if the trial ends immediately). |
| `Observe` | Read the current Battle — hero stats, minion array, element pools, hand contents, the playable cards, and the Outcome (set once the trial ends). |
| `Submit(action)` | Submit the chosen action; resolve it (including the automatic cascade — minion attacks, element damage, turn end) and advance to the next decision point, or set the Outcome if the Battle ends. Fires Events to the listener during resolution. |
| `Peek(action)` | Return a forked engine as it would look after applying `action`, without committing. `greedy` and `lookahead` rely on this. |

The names mirror the authoritative [Design-010: Engine Prototype](./Design-010_engine-prototype.md#operations); Lab consumes that surface unchanged.

### What a decision point exposes

The engine yields one decision per turn-state — there is no mid-cascade suspension; attacks and element damage resolve automatically inside `Submit`. At each decision point `Observe` returns:

- the **current state** — hero stats, minion array, element pools, hand contents (shape is universe-specific),
- the **playable cards**, each carrying its target requirement (per Design-008's `activation`),
- the **available targets** by category (own minions, enemy minions, heroes, empty slots).

The two action kinds are `playCard` and `endTurn` ([Design-010 — Actions](./Design-010_engine-prototype.md#actions)); `endTurn` is always legal in the prototype, and minion attacks and element damage are *not* actions — they happen automatically during `Submit`. Lab-side helpers enumerate legal (action, target) pairs from these ingredients (see [Guinea Pigs](#guinea-pigs)). The engine itself doesn't enumerate combinations.

### Determinism

Same `snapshot` + same `seed` + same submitted action sequence → identical event stream. No wall-clock reads, no global state, no environment-dependent inputs inside the engine. This is what makes Experiment reproducibility work.

### Resolution

Lab picks which engine to run from the Protocol's Universe — the binding lives in Codex (a field on the Universe entity; mechanism specified in the Engine design doc). Lab rejects Protocols targeting Universes with no engine bound.

## Guinea Pigs

A Guinea Pig is a configured player: a **character** (an action-selection strategy) plus the params that character takes. At each decision point it receives the current state and the legal actions and returns one action to submit. A character is a **code module**, universe-agnostic in MVP, operating on the engine's decision-point shape without knowing which Universe is loaded.

The Guinea Pig is a **value object** — `{ character, …params }`, e.g. `{ character: 'lookahead', depth: 3 }`. It is inlined per Protocol side today; if designers later need to name, save, clone, and reuse configured Guinea Pigs (as they do Criteria), it promotes to an entity referenced by id. That change is additive.

Action combination is not the engine's concern. At each decision point the engine exposes the playable cards with their target requirements, plus the available target categories (own minions, enemy minions, heroes, empty slots). A Lab-side helper enumerates valid (action, target) pairs by matching each card's requirement to the categories, always including `endTurn`; the character consumes the enumerated list. For `greedy` and `lookahead`, each candidate is peeked and scored.

### Characters

| Character   | Params | Description |
|-------------|--------|-------------|
| `random`    | —      | Uniform random over legal actions. Baseline / control. |
| `greedy`    | —      | For each legal action, peek the resulting state, score via the Criterion, pick max. |
| `lookahead` | `depth` | Search `depth` plies forward, assuming the opponent uses a symmetric Guinea Pig; pick the action with the best leaf score. Phase 3. |

Future: Monte Carlo Tree Search and ML / RL characters; per-Universe characters will likely emerge as Universes diverge in shape, since MVP only gets away with universal characters because all MVP Universes share the engine's decision-point shape. The interface accommodates these; MVP doesn't ship them.

## Scoring

Scoring turns a match state into a single number — used by `greedy` Guinea Pigs to compare candidate actions, by `lookahead` to evaluate leaf states, and by Lab's analytics to produce per-turn score trajectories. A Criterion combines two things: the Universe's **feature catalog** and **weights** chosen by the designer.

### Features

A feature is a named expression over match state that evaluates to a number (booleans coerce to 0/1): `{ name, expression }`, where `expression` uses the [Design-008](./Design-008_card-dsl.md) grammar and is read by the shared expression evaluator. `owner*` / `enemy*` resolve relative to the Combatant being scored, so the same feature evaluated once per Combatant yields that side's score (hence the two score curves).

A feature is therefore an **authored value object**, not an entity — only its `name` is referenced (by Criterion weights). The **feature catalog** is per-Universe and its home is the Universe's **Lab settings** (the per-Universe bundle each realm extends — see [Universe settings](../tasks/DOD-0024_universe-settings.md)); Lab snapshots it at experiment start, like Codex content, for reproducibility. **For MVP the catalog is hardcoded in Lab**; promoting it to authored settings is additive, since Criteria already reference features by name.

Examples (`name` → `expression`):

| `name` | `expression` | Coverage |
|---|---|---|
| `ownerHeroHealth` | `"ownerHero.stats.health"` | direct path |
| `heroHealthLead` | `{ sub: ["ownerHero.stats.health", "enemyHero.stats.health"] }` | operators |
| `enemyMinionCount` | `{ count: ["enemyMinions"] }` | collection op |
| `topTwoOwnerAttack` | `{ sumTopBy: ["ownerMinions", 2, "attack"] }` | collection op |
| `ownerBoardAttack` | `{ sumBy: ["ownerMinions", "attack"] }` | needs `sumBy` |
| `ownerHandSize` | `{ count: ["ownerHand"] }` | needs hand access |
| `ownerElementTotal` | `{ sumValues: ["ownerHero.elements"] }` | needs map-sum |

**DSL coverage.** Most useful features map straight onto the existing grammar. Making features fully authored needs two **additive** extensions to the DSL — neither a redesign, and neither needed for MVP (hardcoded features sidestep both):

- an **aggregate-all operator** (`sumBy` / `avg` over a collection) — today only `sumTopBy(coll, N, stat)` exists;
- **scoring-context state access** the card DSL doesn't expose — hand / deck size, and sum over the element map.

### Weights

A Criterion picks weights over the features it cares about. Each weight is a real number — positive (more is better) or negative (less is better). Features the Criterion doesn't reference get weight 0 implicitly.

The score of a state is the dot product `score = Σ weight[i] × feature[i](state)`. A single number per state, comparable across actions, across turns, and across Trials.

### Score curve

A Trial's *score curve* is the sequence of scores across its Observations — one per decision point. The same Criterion is applied to both sides, so a Trial yields two curves (owner and enemy). Aggregated across an Experiment's Trials, these become the per-turn score trajectory shown in Findings.

## Analysis & representation

Lab supports analysis at two scales: **per-Trial** (one game, full inspection) and **per-Experiment** (aggregate over a batch). Per-Experiment is the primary surface — that's where balance signal lives.

### Per-Trial

Beyond the raw Observation log:

- **Critical moments** — Observations where the score delta exceeds a threshold. The turning point, without scrolling.
- **Termination reason** — HP zero, deck-out, turn limit.

A deep-dive view for "why did the AI lose this specific game?", not the primary research surface.

### Research questions Lab answers

Lab ships a **fixed taxonomy** of platform-level research questions. Each has a canonical Council view; universe specificity comes from the feature catalog, not the UI.

| Question | Findings surface | Council view |
|---|---|---|
| Is this matchup balanced? | Win rate with confidence band | Bar with 50% target line |
| Is this Card overpowered? | Win-when-played per Card, delta vs baseline | Ranked scatter: frequency × win-when-played |
| Is this Card underused? | Frequency-when-available per Card | Sorted bar list |
| How long do matches last? | Length distribution | Histogram with mean / median markers |
| Which Guinea Pig plays this better? | Win rate stratified by Guinea Pig | Side-by-side bars |
| Which Criterion better models the Universe? | Win rate stratified by Criterion | Side-by-side bars |
| Did this change matter? | Two Findings overlaid | Overlaid trajectories + delta panel |

One row = one screen in Council. No chart-editor knobs, no arbitrary metric composition. Adding a question is a platform change (new Findings field + new Council view); MVP ships this set.

### Research validity

A Findings always carries:

- **Confidence bands** on every aggregate, derived from `trialCount`.
- **Sample-size hints** — when a win-rate confidence interval crosses 50%, mark inconclusive and suggest a larger N.
- **N always shown** with every metric.

Without confidence reporting, Lab is a roulette wheel — designers would chase noise.

### Flexibility through feature catalogs, not through UI

The fixed taxonomy works across Universes because each question's **shape** is universe-agnostic; only its **content** is universe-specific.

- **Shape** — chart type, axes, statistical treatment — is the same in every Universe. Council renders the same screens.
- **Content** — what's being aggregated — comes from primitives shared by every game (`winner`, `turnsPlayed`, `cardsPlayed`) or from the Universe's Criterion feature catalog (score trajectories take their meaning from DoM's elements vs Cyber Deal's debt-clock vs whatever else).

Designers don't author charts; they pick a question, configure inputs (Heroes, decks, Criterion, Guinea Pig), and read the canonical view. Adding analytic depth within an existing question = feature-catalog change in Lab. Adding a fundamentally new question = platform change. The wall is deliberate: flexibility through catalogs keeps the UI explicit and finite.

## Worked example: balance check

A designer wants to test whether Fire Drake outperforms Wall of Fire in mid-game.

**Setup.** In Council the designer picks two Heroes from the DoM Universe and builds two decks — Side A heavy on Fire Drake, Side B heavy on Wall of Fire. Both sides use the `greedy` Guinea Pig and Lab's default DoM Criterion. The designer creates a Protocol.

**Execution.** The designer starts an Experiment with `trialCount=1000`. Lab loads the Codex content snapshot once, then runs 1000 Trials. Each Trial:

1. `Construct(snapshot, initialSetup, seed, onEvent)` advances to the first decision point.
2. The Lab helper enumerates legal (action, target) pairs from the `Observe` ingredients.
3. The `greedy` Guinea Pig peeks each candidate, scores it via the Criterion, picks the max.
4. `Submit(chosenAction)` resolves it (with the automatic cascade) and advances to the next decision point, until the Outcome is set.
5. Lab records the Trial — Observations (each with its buffered engine event delta) and the outcome.

**Reading the result.** Lab aggregates the 1000 terminals into Findings. Council renders the *Is this matchup balanced?* view: Side A wins 38% ±2%; confidence crosses 50% → "results inconclusive, consider larger N". The *Is this Card overpowered?* view shows Fire Drake at +12 win-when-played vs baseline, Wall of Fire at +5 — suggestive but within noise.

**Iteration.** Designer clones the default Criterion, raises the weight on `ownerMinions.totalAttack`, and runs a Comparison Experiment with both Criteria. After 1000 Trials, the new Criterion wins 57% of side-by-side games — kept as the next-revision baseline.

## Out of scope (MVP)

The following are intentionally excluded from this design. They may return in later iterations.

- **Real-time human play.** A networked match flow with human input belongs to the future Battle realm; Lab only drives the engine via Guinea Pigs.
- **Comparison against real-match data.** Recording real human matches and replaying them through Lab to measure prediction accuracy is a future-milestone goal. The Match log shape leaves room for it; the consumer side is not built here.
- **Per-Protocol rule overrides.** Rules are inherited from the Universe in MVP. A richer rules design (trait-enable flags, turn-phase composition, draft-pool rules) lands later, when concrete needs emerge.
- **ML / RL Guinea Pigs.** The Guinea Pig interface accommodates them; MVP ships only `random`, `greedy`, `lookahead`.
- **Cross-Universe Experiments.** A Protocol is scoped to exactly one Universe.
- **Deck-construction search.** Cross-match strategy search (which deck wins more often? which Hero counters which?) is in [Milestone-007](../milestones/Milestone-007_lab-engine.md) Phase 3 scope; specified separately when it lands.
- **Exhaustive log retention.** Lab samples full per-Trial Observation logs for inspection rather than archiving every Trial's log. Aggregates in Findings are always retained.
- **Custom chart authoring / power-user metric composition.** The research-question taxonomy is fixed; new questions are platform changes, not designer-authored compositions. The wall is deliberate — see [Analysis & representation](#analysis--representation).
- **Authoring permissions.** Who may submit Protocols or edit Criteria is a Citizen / authorization concern, not specified here.
