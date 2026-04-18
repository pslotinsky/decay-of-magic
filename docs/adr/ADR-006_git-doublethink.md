# ADR-006: Git Doublethink

| Field   | Value      |
| ------- | ---------- |
| Status  | Accepted   |
| Related | [ADR-003: Git Only](./ADR-003_git-only.md) |
| Created | 2026-04-19 |

## Context

![Git is watching you](../assets/git-is-watching-you.webp)

The repository stores architectural decisions and significant tasks as markdown files (see ADR-003).
Not every code change represents a meaningful architectural step.

Creating a task for minor maintenance changes — formatting, lint rules, padding tweaks, small refactors — would introduce noise and reduce the signal value of the task history.

At the same time, commit history should remain structured and readable even for untracked changes.

**Why not conventional commits for everything?**
Task-linked commits carry richer context than a semantic prefix alone. `DOD-0013: Add Universe realm` links directly to a task document with motivation, design notes, and acceptance criteria. `feat: add universe realm` carries none of that. For meaningful work, the task reference is strictly more informative.

**Why not task IDs for everything?**
Creating a `DOD-XXXX` task for a two-pixel padding fix or a lint rule change is ceremony without value. It pollutes the task list and makes it harder to find decisions that actually matter.

## Decision

Two commit styles are used depending on whether the change has a corresponding task document.

### Task-linked commits

Used when a task, ADR, design, or devlog document exists for the change. The commit references the document identifier:

```
DOD-0013: Add Universe realm
DOD-0013: Close task
ADR-006: Describe commit convention
DevLog-007: Add session implementation notes
```

A document should exist before the commit is made.

### Maintenance commits

Used when the change has no standalone architectural value and creating a task would be noise. Uses conventional commit prefixes:

```
feat: add pagination to universe list
fix: correct permit validation rule
refactor: extract EntityRepository base class
docs: clarify CQRS boundary in blueprint
test: add e2e for citizen login
chore: enforce import order
```

## Consequences

### Benefits

- task history stays focused on meaningful architectural progress
- commit history is structured and readable for both tracked and untracked changes
- the distinction makes it immediately clear which commits have backing documentation
- no ceremony overhead for trivial changes

### Drawbacks

- two styles coexist in git log, which looks inconsistent without knowing the rule
- conventional commit tooling (automatic changelogs, semantic versioning) cannot be applied to task-linked commits
