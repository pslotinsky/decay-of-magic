# DOD-0015: Define testing strategy for realm services

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Status    | In progress                                                                                     |
| Milestone | [Platform Baseline & Consistency](../milestones/Milestone-004_platform-baseline-consistency.md) |
| Created   | 2026-04-19                                                                                      |

## Description

Describe the testing approach used for realm services.

Clarify:

- which test levels are used
- why service-level API tests with real infrastructure are currently preferred
- why extensive unit testing is not required for CRUD-dominated services
- when cross-realm end-to-end tests become relevant
- naming conventions for test types (avoid ambiguity of "e2e")

Goal: make testing expectations explicit and prevent inconsistent strategies across realms.
