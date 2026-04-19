# Design-005: API Guidelines

| Field   | Value      |
| ------- | ---------- |
| Created | 2026-04-19 |

## Overview

Rules for HTTP APIs exposed by realms, independent of language, framework, or deployment stack. Scope is the wire protocol only: URLs, verbs, status codes, response and error shapes, versioning, naming.

This doc describes the **target**. Existing code may diverge; new endpoints and realms must conform.

Related: [ADR-005: REST In Peace](../adr/ADR-005_rest-in-peace.md) — decision to use REST-style HTTP.

## URL shape

```
/api/v<major>/<resource>[/<id>][/<sub-resource>]
```

- `/api` — global prefix for every realm.
- `/v<major>` — API major version; bumped on breaking changes (see [Versioning](#versioning)).
- `<resource>` — **singular**, **kebab-case** (`/v1/universe`, `/v1/card`, `/v1/citizen-permit`).
- `<id>` — path parameter identifying a single resource.
- `<sub-resource>` — nested resource when the relation is intrinsic (`/v1/universe/:id/member`).

Rationale for singular: reads naturally for both the collection and a single item (`GET /v1/card` — “the card resource, all items”; `GET /v1/card/:id` — “the card resource, one item”).

Cross-realm composition is the **gateway's** concern, not the realms'. Realms expose their own resources only.

## Verbs and endpoints

Standard CRUD shape per resource:

| Verb     | Path              | Purpose                 | Success status    | Request body   | Response `data` |
| -------- | ----------------- | ----------------------- | ----------------- | -------------- | --------------- |
| `POST`   | `/<resource>`     | Create                  | `201 Created`     | `CreateXxxDto` | `XxxDto`        |
| `GET`    | `/<resource>`     | List (optional filters) | `200 OK`          | —              | `XxxDto[]`      |
| `GET`    | `/<resource>/:id` | Read one                | `200 OK`          | —              | `XxxDto`        |
| `PATCH`  | `/<resource>/:id` | Partial update          | `200 OK`          | `UpdateXxxDto` | `XxxDto`        |
| `DELETE` | `/<resource>/:id` | Delete                  | `204 No Content`  | —              | —               |

The response column shows the payload carried in the envelope's `data` field — the full body on the wire is `{ "data": …, "meta": … }` (see [Success envelope](#success-envelope)). Request bodies are **not** enveloped; the client sends `CreateXxxDto` / `UpdateXxxDto` directly as the JSON root.

Notes:

- `POST` always returns the created resource — never just an id, never an empty body. Clients should not need a second round-trip to read what they just wrote.
- `PATCH` uses **merge semantics**: the request body is a partial resource; provided fields replace existing values, omitted fields stay untouched. RFC 6902 JSON Patch is **not** used.
- `PUT` is not used; full replacement is not part of the baseline.
- `DELETE` is idempotent in intent but returns `404` for an already-deleted resource, not `204`. The transport is honest about whether the resource currently exists.

## Success envelope

Every `2xx` response with a body is wrapped in an envelope:

```json
{
  "data": <payload>,
  "meta": <optional object>
}
```

**Single resource:**

```json
{
  "data": { "id": "…", "name": "…" }
}
```

**Collection:**

```json
{
  "data": [{ "id": "…" }, { "id": "…" }],
  "meta": { "total": 42 }
}
```

Rules:

- `data` is always present on `2xx` with a body. It is the payload described by the endpoint; no other root keys carry business data.
- `meta` is optional and reserved for transport concerns (pagination, totals, cursors). Never put domain fields in `meta`.
- `204` responses have no envelope and no body.

The envelope costs one indirection today but removes a breaking change later when pagination, cursors, or per-response warnings become necessary. It is cheaper to have it from day one than to migrate every client.

## Status codes

| Code  | When                                                                                 |
| ----- | ------------------------------------------------------------------------------------ |
| `200` | Successful `GET`, `PATCH`.                                                           |
| `201` | Successful `POST` that created a resource.                                           |
| `204` | Successful `DELETE`.                                                                 |
| `400` | Malformed request (bad JSON, wrong type, missing required field).                    |
| `401` | Authentication required or token invalid. Issued by the **gateway**, not a realm.    |
| `403` | Authenticated but not allowed.                                                       |
| `404` | Resource not found, or a route that doesn't exist.                                   |
| `409` | Conflict (unique constraint, state invariant violated).                              |
| `422` | Semantically invalid request (well-formed but rejected by domain rules).             |
| `500` | Unhandled server error.                                                              |

## Error envelope

Every non-`2xx` response has an error envelope. Shape is the same regardless of who raised it (framework, realm, gateway):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Universe not found",
    "details": []
  }
}
```

Fields:

- `code` — machine-readable, **UPPER_SNAKE_CASE**, stable across versions. Clients branch on `code`, never on `message`.
- `message` — human-readable, for developers and logs. Not localized. Not shown directly to end users.
- `details` — optional array of sub-errors, used when a single request fails on multiple inputs (typically validation).

Each entry in `details`:

```json
{
  "code": "REQUIRED",
  "field": "name",
  "message": "must not be empty"
}
```

- `field` uses dot-paths for nested structures (`address.city`, `members.0.role`). Omitted when the error is not tied to a specific field.
- `code` inside `details[]` is a **narrow, per-rule** identifier (`REQUIRED`, `MIN_LENGTH`, `INVALID_UUID`, `UNIQUE`). It is a sub-type of the top-level `code`; clients that only check the top-level code still behave correctly.

### Error code catalog

The baseline set. Additions follow the same naming rule and are documented per realm when introduced.

| Code                 | HTTP | Meaning                                                            |
| -------------------- | ---- | ------------------------------------------------------------------ |
| `BAD_REQUEST`        | 400  | Request could not be parsed at all (invalid JSON, wrong content type). No `details`. |
| `VALIDATION_FAILED`  | 400  | Request parsed but one or more fields violated the schema. `details` lists each field. |
| `UNAUTHENTICATED`    | 401  | Missing or invalid credentials.                                    |
| `FORBIDDEN`          | 403  | Authenticated but not authorized.                                  |
| `NOT_FOUND`          | 404  | Resource or route does not exist.                                  |
| `CONFLICT`           | 409  | State or uniqueness constraint violated.                           |
| `UNPROCESSABLE`      | 422  | Domain rule rejected an otherwise valid request.                   |
| `INTERNAL_ERROR`     | 500  | Unexpected server failure.                                         |

Error codes are deliberately stack-agnostic. They decouple clients from whichever framework or library produced the error internally.

## Naming

**Endpoints and resources**

- Resource names: singular, kebab-case, noun (`/citizen-permit`, not `/citizens` or `/citizenPermits`).
- Sub-resource names: same rule, scoped by the parent.
- Query parameters: camelCase (`universeId`, `createdAfter`).

**Payloads**

| Purpose           | Type name           |
| ----------------- | ------------------- |
| Response payload  | `XxxDto`            |
| Create input      | `CreateXxxDto`      |
| Update input      | `UpdateXxxDto`      |
| List filter input | `ListXxxQueryDto`   |

**Payload fields**

- camelCase (`createdAt`, `universeId`).
- IDs are strings (UUIDs by default).
- Timestamps are ISO-8601 strings in UTC with offset (`2026-04-19T12:34:56Z`).
- Booleans are `true`/`false`, never `0`/`1` or `"yes"`/`"no"`.
- Absent values are omitted from the payload rather than returned as `null`, unless `null` is semantically meaningful (field is nullable in the domain).

**Operation naming**

Each endpoint is a conceptual operation. Use these verbs in the OpenAPI operationId and any generated client SDK: `create`, `update`, `remove`, `getById`, `list`. Do not use `find` for a listing endpoint — `find` denotes a possibly-empty single result and clashes with collection semantics.

## Versioning

- The URL carries a single major version: `/api/v1`, `/api/v2`, …
- Breaking changes (removed or renamed field, changed type, changed semantics, stricter validation) require a new version.
- Additive changes (new optional field, new endpoint, new error code) do not.
- A realm may expose multiple major versions concurrently during migration; removing an old version requires coordination with the gateway and all consumers.
- No minor/patch version in the URL. No per-endpoint versioning. One resource, one live major version at a time is the target.

### Current practice

While all API consumers are first-party web apps deployed together with the realms, versioning is effectively a **no-op**: clients and servers ship from the same repo and upgrade in lockstep, so breaking changes can be made freely without bumping the major version. `/api/v1` is the single live version and stays that way.

This relaxes once any of the following is true:

- a third-party (or differently-scheduled) client consumes a realm's API
- clients are released independently of the realms (native apps, long-lived SDKs, partner integrations)
- external documentation or a public contract is published

At that point the rules above apply strictly, and breaking changes require `/api/v2`.

## Open topics

Intentionally unresolved; revisit when a first real need arrives:

- **Pagination** — cursor vs offset. Carried in `meta` regardless.
- **Idempotency keys** for `POST`.
- **Bulk operations** (batch create / update / delete).
- **Localization of error messages**.
- **Field selection / sparse responses**. If this becomes urgent, it is a signal to reconsider REST, not to retrofit it.
