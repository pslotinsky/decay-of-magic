# DOD-0011: Describe Universe API and tests

| Field     | Value                                                           |
| --------- | --------------------------------------------------------------- |
| Status    | Done                                                            |
| Milestone | [Universe Realm](../milestones/Milestone-003_universe-realm.md) |
| Created   | 2026-04-16                                                      |

## Description

Define API contract and expected behavior for the Universe realm.

## Scope

### Fields

- `id` — string, provided by the application
- `name` — string, required, unique, 1–100 characters
- `description` — string, optional, max 500 characters
- `cover` — URL string, optional

### Endpoints

```
POST   /v1/universe
PATCH  /v1/universe/:id
GET    /v1/universe
GET    /v1/universe/:id
```

### Test scenarios

#### POST /v1/universe
- creates universe and returns id and name
- creates universe with description and cover
- returns 409 when name already exists
- returns 400 when name is missing
- returns 400 when name is empty
- returns 400 when name exceeds 100 characters
- returns 400 when cover is not a valid URL
- returns 400 when description exceeds 500 characters

#### PATCH /v1/universe/:id
- updates name
- updates description and cover
- returns 404 when universe not found
- returns 409 when renaming to an existing universe name
- returns 400 when name is empty
- returns 400 when cover is not a valid URL

#### GET /v1/universe/:id
- returns universe by id
- returns 404 when universe not found

#### GET /v1/universe
- returns collection of universes
- returns empty array when no universes exist
