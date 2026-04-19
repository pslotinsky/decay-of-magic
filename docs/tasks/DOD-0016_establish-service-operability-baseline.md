# DOD-0016: Establish service operability baseline

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Status    | In progress                                                                                     |
| Milestone | [Platform Baseline & Consistency](../milestones/Milestone-004_platform-baseline-consistency.md) |
| Created   | 2026-04-19                                                                                      |

## Description

Introduce minimal operational baseline required before cross-realm communication is added.

Scope:

- add health endpoints for services
- ensure CI configuration is consistent across realms
- introduce Dependabot for dependency monitoring

Explicitly out of scope for now:

- distributed tracing
- OpenTelemetry integration
- correlation IDs across services

These may be introduced once real inter-service communication appears.
