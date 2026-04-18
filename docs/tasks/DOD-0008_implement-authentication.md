# DOD-0008: Implement authentication

| Field     | Value                                             |
| --------- | ------------------------------------------------- |
| Status    | Done |
| Milestone | [Citizen Realm](../milestones/Milestone-002_citizen-realm.md) |
| Created   | 2026-04-11                                        |

## Description

Implement authentication for the Citizen realm.

Authentication uses citizen nickname and permit secret.

On success, the realm issues JWT access token and validates it for other services.

## Scope

Implement use cases:

- Authenticate citizen
- Validate access token

Authentication flow:

- find citizen by nickname
- load CitizenPermit
- verify secret
- issue JWT
- validate JWT
- return citizen id from valid token
