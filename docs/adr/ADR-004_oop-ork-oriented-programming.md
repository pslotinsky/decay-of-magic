# ADR-004: OOP — Ork Oriented Programming

| Field   | Value       |
| ------- | ----------- |
| Status  | Accepted |
| Created | 2026-04-11  |

## Context

I enjoy OOP, DDD, and structured architecture. However, turning the game into a chapter from *Patterns of Enterprise Application Architecture* would be unnecessarily heavy.

Another practice I find appealing is **metaphor-driven programming** — using a consistent metaphor to shape the structure and language of the system.

Combining these ideas leads to **OOP — Ork Oriented Programming**.

The goal is to keep architectural clarity while forming a cohesive and memorable ubiquitous language aligned with the game world.

Each service can be seen as its own world.
Its structure should feel natural within that world, not purely technical.

<img alt="OOP" src="../assets/oop-small.webp" style="background: #fff; border-radius: 8px">

## Decision

Concepts and components may use thematic names that form a consistent metaphor aligned with the game world.

Each service is treated as its own **Realm**.

The main architectural layers are renamed as follows:

| Classic layer | Term | Note |
|--------------|------|------|
| presentation / api | frontier | the edge of the Realm — where the outside world enters |
| application | law | natural law — the invisible rules governing how a Realm operates |
| domain | lore | the accumulated knowledge and truth of the Realm |
| infrastructure | ground | the foundation everything rests upon |

Resulting structure:

> Frontier → Law → Lore → Ground

The metaphor-driven approach is intended to guide naming across the entire system

Examples of structural components that follow the metaphor:

| Standard term | Possible term |
|--------------|--------------|
| Controller | Gate |
| ValueObject | Essence |
| UseCase | Edict / DutyInstruction |

Examples of domain-level naming aligned with the world metaphor:

| Standard term | Possible term |
|--------------|--------------|
| Account / Identity | CitizenPermit |
| User | Citizen |

---

## Consequences

### Positive

- creates a consistent ubiquitous language
- reinforces project identity
- improves memorability of architecture
- keeps compatibility with DDD concepts
- supports metaphor-driven design
- keeps services conceptually cohesive

### Tradeoffs

- requires initial onboarding explanation
- slightly diverges from standard naming conventions
- may reduce immediate familiarity for new developers
