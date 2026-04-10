# DOD-0007: Implement Citizen and Permit

| Field     | Value                                             |
| --------- | ------------------------------------------------- |
| Status    | In progress                                       |
| Milestone | [Citizen](../milestones/Milestone-002_citizen.md) |
| Created   | 2026-04-11                                        |

## Description

Implement storage and basic operations for Citizen and CitizenPermit.

CitizenPermit is issued automatically when a citizen is registered.

Authentication is out of scope.

## Domain concepts

**Citizen** — an individual recorded in the registry.

Fields: `id`, `nickname` (unique).

**CitizenPermit** — a personal permit granting access to the system. Issued automatically on citizen registration. Secret is a generated hash.

Fields: `citizenId`, `secret`, `issuedAt`.

Each citizen has exactly one permit.

## Scope

Implement use cases:

- Register citizen
- Update citizen
- Get citizen by id
- List citizens
