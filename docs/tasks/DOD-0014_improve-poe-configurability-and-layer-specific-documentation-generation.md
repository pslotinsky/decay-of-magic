# DOD-0014: Improve Poe configurability and layer-specific documentation generation

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
