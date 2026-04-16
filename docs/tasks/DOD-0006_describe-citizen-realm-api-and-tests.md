# DOD-0006: Describe Citizen realm API and tests

| Field     | Value                                             |
| --------- | ------------------------------------------------- |
| Status    | Done |
| Milestone | [Citizen Realm](../milestones/Milestone-002_citizen-realm.md) |
| Created   | 2026-04-11                                        |

## Description

Define API contract and expected behavior for the Citizen realm.

## Scope

### Endpoints

#### Citizens

```
POST   /citizens
PATCH  /citizens/:id
GET    /citizens
GET    /citizens/:id
```

#### Sessions

```
POST   /sessions
```

Authenticates citizen using nickname and permit secret.

Returns access token (JWT).

#### Token validation

Define mechanism for token validation that can be used by gateway or other realms.

### Behaviour

Describe expected behaviour for:

register citizen:
- creates Citizen
- creates CitizenPermit
- records issuedAt timestamp

update citizen:
- updates mutable fields only

get citizen:
- returns citizen by id

list citizens:
- returns collection of citizens

authenticate:
- verifies nickname exists
- verifies provided secret
- returns access token

token validation:
- verifies token signature
- verifies token is not expired
- returns citizen id

### Errors

Define expected error scenarios:

- nickname already exists
- citizen not found
- invalid credentials
- invalid input format
- invalid token
- expired token
