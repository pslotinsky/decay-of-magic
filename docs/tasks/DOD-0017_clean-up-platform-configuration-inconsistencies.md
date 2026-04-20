# DOD-0017: Clean up platform configuration inconsistencies

| Field     | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| Status    | Done |
| Milestone | [Platform Baseline & Consistency](../milestones/Milestone-004_platform-baseline-consistency.md) |
| Created   | 2026-04-19                                                                                      |

## Description

Resolve technical inconsistencies in platform configuration.

Examples:

- ensure environment variables are consistently handled across services
- review docker-compose configuration for symmetry between realms
- replace `JWT_SECRET ?? 'dev-secret'` fallback with a hard startup failure when the variable is missing
- check if CI DATABASE_URL hardcoded to citizen
- think about Helmet/CORS

Goal: prevent configuration drift as the number of realms grows.
