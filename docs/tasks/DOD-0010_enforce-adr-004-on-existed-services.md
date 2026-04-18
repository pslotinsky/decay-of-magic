# DOD-0010: Enforce ADR-004 on existed services

| Field     | Value                                             |
| --------- | ------------------------------------------------- |
| Status    | Done |
| Milestone | [Citizen Realm](../milestones/Milestone-002_citizen-realm.md) |
| Created   | 2026-04-11                                        |

## Description

Apply [ADR-004: OOP — Ork Oriented Programming](../adr/ADR-004_oop-ork-oriented-programming.md) conventions to all existing services: rename services to realms, rename architectural layers, and rename structural components to match the ubiquitous language.

## Scope

### Rename services to realms

Move services from `services/` to `realms/` and rename each:

| Before | After |
|--------|-------|
| `services/codex-service` | `realms/codex-realm` |
| `services/vault-service` | `realms/vault-realm` |
| `services/gateway-service` | `realms/gateway-realm` |

Update all references: workspace config, Dockerfiles, docker-compose, CI.

### Rename architectural layers

Rename layer directories inside each realm's `src/`:

| Before | After |
|--------|-------|
| `api/` | `frontier/` |
| `application/` | `law/` |
| `domain/` | `lore/` |
| `infrastructure/` | `ground/` |

Update all imports across the codebase.

### Rename structural components

| Before | After |
|--------|-------|
| `CardController` | `CardGate` |
| `ManaController` | `ManaGate` |
| `FileController` | `FileGate` |

Rename class names and file names accordingly (e.g. `card.controller.ts` → `card.gate.ts`).

### Update configuration

- Root `package.json`: workspace glob `services/*` → `realms/*`
- Each realm's `package.json`: package name `*-service` → `*-realm`
- `prisma.config.ts`: update path to schema inside `ground/`
- `docker-compose.yml` and all `Dockerfile` files: update all paths and prune targets
- `.github/workflows/ci.yml`: update artifact paths
