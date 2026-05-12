# ADR-007: Zebra Cadence

| Field   | Value       |
| ------- | ----------- |
| Status  | Accepted    |
| Related |             |
| Created | 2026-05-12  |

## Context

Continuous product-focused development causes:
- accumulation of technical debt
- inconsistent architecture
- reduced development velocity
- increased cognitive load

## Decision

The roadmap should alternate between:
- product milestones
- technical "Tidy up" milestones

After every 1–3 product milestones, at least one Tidy up milestone should be planned

### Notes

Tidy up milestones are intended to improve future development speed and maintainability

They must not become endless refactoring efforts detached from product goals

## Consequences

### Pros

- more consistent architecture
- improved tooling
- reduced entropy
- better developer experience
- more sustainable long-term development

### Cons

- slower short-term feature delivery
- risk of over-investing in cleanup
