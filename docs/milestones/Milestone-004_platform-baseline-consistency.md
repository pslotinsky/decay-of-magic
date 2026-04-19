# Milestone-004: Platform Baseline & Consistency

| Field   | Value                                |
| ------- | ------------------------------------ |
| Status  | In progress                          |
| Roadmap | [MVP](../roadmaps/Roadmap-01_mvp.md) |
| Created | 2026-04-19                           |

## Description

This milestone improves architectural consistency, documentation clarity, and operational baseline across the platform.

The focus is not on adding new domain features, but on strengthening the foundation before introducing cross-realm interactions and more complex business logic.

Key goals:

- define consistent API conventions across realms
- formalize testing strategy for service-level APIs
- improve automated documentation generation via Poe
- establish minimal operability baseline (health checks, CI hygiene)
- eliminate technical inconsistencies across monorepo, security configuration, and frontend data layer

These improvements ensure that future realms and features can be added without accumulating structural inconsistencies.

## Tasks

<!-- TOC.START: task -->
- [ ] [DOD-0014: Improve Poe configurability and layer-specific documentation generation](../tasks/DOD-0014_improve-poe-configurability-and-layer-specific-documentation-generation.md)
- [x] [DOD-0015: Define testing strategy for realm services](../tasks/DOD-0015_define-testing-strategy-for-realm-services.md)
- [x] [DOD-0016: Establish service operability baseline](../tasks/DOD-0016_establish-service-operability-baseline.md)
- [x] [DOD-0017: Clean up platform configuration inconsistencies](../tasks/DOD-0017_clean-up-platform-configuration-inconsistencies.md)
- [x] [DOD-0018: Refactor frontend api layer](../tasks/DOD-0018_refactor-frontend-api-layer.md)
- [x] [DOD-0019: Define API conventions for realm services](../tasks/DOD-0019_define-api-conventions-for-realm-services.md)
<!-- TOC.END -->
