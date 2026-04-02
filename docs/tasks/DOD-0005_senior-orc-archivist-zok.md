# DOD-0005: Senior orc archivist Zok

| Field     | Value                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------- |
| Status    | In progress                                                                                        |
| Milestone | [Infrastructure and documentation](../milestones/Milestone-001_infrastucture-and-documentation.md) |
| Created   | 2025-06-21                                                                                         |

## Description

- [Zok's idea](../ideas/Idea-001_archivist-zok.md)
- [Zok's ADR](../adr/ADR-002_zok-for-doc.md)
- [Zok's design](../design/Design-001_the-inner-world-of-zok.md)

### MVP Scope:

- [x] Manage entities (roadmaps, milestones, tasks, adrs, ideas, devlogs)
  - [x] Create new entity: `zok create task "Senior orc archivist Zok"` // For now without attributes
  - [x] Change entity status: `zok close task DOD-0005` (also `reopen`, `cancel`) // Now list of commands is fixed. In future it may be customized
  - [x] Change entity name: `zok rename task DOD-0005 "Zok MVP"`
  - [x] List entities: `zok list tasks` // For now without filter and pagination
  - [x] Auto bind active milestones and roadmaps
  - [ ] Change attributes `zok update task 'Milestone:Milestone-002'`
  - [x] Link fields render as markdown links `[Title](path/to/file.md)` instead of raw ID
- [x] Entities must be configured from config files
  - [x] Directory (`docs/adr`, `docs/devlogs`, ...) // TODO: Think about a scope (README.md + docs)?
  - [x] Name (`task` / `tasks`, `idea` / `ideas`, ...)
  - [x] Prefix (`DOD`, `Idea`, `DevLog`, ...) // TODO: Think about tasks with different prefixes
  - [x] Relations (Roadmap -> Milestone -> Task)
  - [x] Attributes (`Status`, `Created`, `Milestone`, ...) // For now logic may be fixed. But think about customization
  - [x] Templates (for ADT: title + attributes + Context + Decision + Consequences)
- [x] Links
  - [x] File name generated from name (`Zok MVP` -> `DOD-0005_zok-mvp.md`)
  - [ ] ~~File name changed on entity name change~~
  - [x] Zok can generate links for relations
  - [x] Zok can generate `table of content` for entities and embed it into `README`
  - [x] If entity has status, it will be rendered differently in `table of content`
  - [x] If entity status changed, it will change appearance in `table of content` and relations

Think about auto generation from package.json and \*.ts comments
