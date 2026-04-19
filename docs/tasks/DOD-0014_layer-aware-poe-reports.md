# DOD-0014: Layer-aware Poe reports

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Status    | In progress                                                                                     |
| Milestone | [Platform Baseline & Consistency](../milestones/Milestone-004_platform-baseline-consistency.md) |
| Created   | 2026-04-19                                                                                      |

## Description

Extend Poe to support configurable documentation generation strategies depending on architectural layer.

Desired outputs:

Domain layer:

- class descriptions
- relationships between entities/value objects
- dependency references

Application layer:

- list of use cases (commands and queries overview)

API layer:

- endpoint list
- DTO structures
- request/response overview

Infrastructure layer:

- ER diagrams based on schema

Goal: generate useful documentation without producing unnecessary noise.

## Steps

- [x] Step 1 — Per-package `poe.config.mjs` + renderer dispatch; `domain` renderer wired, other renderers fall back to `domain` until their step lands.
- [x] Step 2 — `application` renderer: commands/queries as a use-case list.
- [ ] Step 3 — `api` renderer: endpoint list from controllers.
- [ ] Step 4 — `infrastructure` renderer: ER diagram from Prisma schema.
