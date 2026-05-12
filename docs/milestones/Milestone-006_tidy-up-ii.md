# Milestone-006: Tidy Up II

| Field   | Value                                |
| ------- | ------------------------------------ |
| Status  | Done |
| Roadmap | [MVP](../roadmaps/Roadmap-01_mvp.md) |
| Created | 2026-05-12                           |

## Description

The second tidy-up milestone in the zebra cadence — product milestones alternate with structural ones, and Milestone-004 established the pattern. After landing the Codex realm, accumulated friction in the monorepo structure, CI pipeline, and documentation toolchain is worth resolving before adding more realms and cross-realm interactions.

The focus is the developer-facing surface: where workspaces live, how CI feedback is delivered, and how Poe presents generated documentation.

Key goals:

- distinguish shipped packages from project tools (relocate `poe` and `zok`)
- lift CI bottlenecks and adopt a shared cache instead of artifact passing
- expand the test matrix to cover every realm with API tests
- adopt static dead-code analysis (`knip`) to prevent rot from accumulating
- polish the in-house doc tools (Poe and Zok) and replace the indirect `git diff` assertion in CI

## Tasks

<!-- TOC.START: task -->
- [x] [DOD-0025: Tidy up structure and CI](../tasks/DOD-0025_tidy-up-structure-and-ci.md)
- [x] [DOD-0026: Improve Poe and Zok](../tasks/DOD-0026_improve-poe-and-zok.md)
- [x] [DOD-0027: Migrate to pnpm](../tasks/DOD-0027_migrate-to-pnpm.md)
- [x] [DOD-0028: Migrate to Biome](../tasks/DOD-0028_migrate-to-biome.md)
<!-- TOC.END -->
