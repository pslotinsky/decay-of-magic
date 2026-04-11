# Milestone-002: Citizen

| Field   | Value                                |
| ------- | ------------------------------------ |
| Status  | In progress                          |
| Roadmap | [MVP](../roadmaps/Roadmap-01_mvp.md) |
| Created | 2026-04-11                           |

## Goal

Introduce citizens registry and access mechanism via personal permit.

The system should be able to register citizens, store their pseudonyms, and authenticate them using a secret issued permit.

## Use cases

- Register citizen
- Update citizen
- Get citizen by id
- List citizens
- Authenticate citizen (nickname + secret → JWT)
- Validate access token

## Tasks

<!-- TOC.START: task -->
- [x] [DOD-0006: Describe Citizen realm API and tests](../tasks/DOD-0006_describe-citizen-realm-api-and-tests.md)
- [ ] [DOD-0007: Implement Citizen and Permit](../tasks/DOD-0007_implement-citizen-and-permit.md)
- [ ] [DOD-0008: Implement authentication](../tasks/DOD-0008_implement-authentication.md)
- [ ] [DOD-0009: Citizen UI](../tasks/DOD-0009_citizen-ui.md)
- [x] [DOD-0010: Enforce ADR-004 on existed services](../tasks/DOD-0010_enforce-adr-004-on-existed-services.md)
<!-- TOC.END -->
