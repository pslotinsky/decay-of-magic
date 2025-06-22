# ADR-003: Git Only

| Field   | Value                                            |
| ------- | ------------------------------------------------ |
| Status  | Accepted                                         |
| Created | 2025-06-22                                       |
| Related | [ADR-002: Zok for Doc](./ADR-002_zok-for-doc.md) |

## Context

Although I'm currently the sole developer on this project, I've developed a habit of thinking in terms of tasks and documenting features before writing any code. I enjoy taking time to reflect, design, and plan. Naturally, I'd like to keep the results of these sessions somewhere accessible and versioned.

I definitely don’t need heavyweight tools like Jira, and while there are many excellent documentation engines and hybrid tools that combine issue tracking and knowledge bases, they often introduce their own set of problems:

- Migration between tools can be painful
- Many are overkill for solo development
- They create an unnecessary dependency on third-party platforms

That’s why I’ve decided to keep everything inside the Git repository: tasks, dev logs, rough ideas, architecture designs — and, well, the code too, I guess.  
This “Git-only” approach is simple, self-contained, and provides a number of advantages out of the box:

- Tasks won’t get lost — they can be easily tracked via commit messages
- Documentation is always available and versioned
- Pseudocode diagrams (e.g., Mermaid) can live directly in Markdown
- Works great offline and integrates naturally into development workflow

This approach aligns with existing practices such as:

- [Docs as Code](https://www.writethedocs.org/guide/docs-as-code/)
- [Readme-Driven Development](https://tom.preston-werner.com/2010/08/23/readme-driven-development)

## Decision

Adopt a **Git-only** approach for this project. All project-related artifacts will live in the version-controlled repository alongside the code.

The structure may look like this:

- `docs/adr/` — Architecture Decision Records (like this one)
- `docs/ideas/` — Rough concepts and brainstorming
- `docs/designs/` — System component designs
- `docs/devlogs/` — Daily notes and developer journals
- `docs/roadmaps/` — Short- and mid-term planning
- `docs/milestones/` — Planning checkpoints
- `docs/tasks/` — Simple task lists

All documents will be in Markdown, follow a lightweight structure, and integrate naturally with Git-based workflows.

## Consequences

### Pros

- Single source of truth
- Full version history for all project documents
- Fast, offline-friendly, and easily greppable
- Reduced reliance on external platforms and services

### Cons

- Less user-friendly UI compared to modern task trackers
- Harder to track document relationships or cross-references unless tooling is added
