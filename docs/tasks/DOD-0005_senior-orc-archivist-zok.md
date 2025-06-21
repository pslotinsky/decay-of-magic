# DOD-0005: Senior orc archivist Zok

| Field     | Value                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------- |
| Status    | In progress                                                                                        |
| Milestone | [Infrastructure and documentation](../milestones/Milestone-001_infrastucture-and-documentation.md) |
| Created   | 2025-06-21                                                                                         |

## Description

- [Zok's idea](../ideas/Idea-001_archivist-zok.md)
- [Zok's ADR](../adr/ADR-002_zok-for-doc.md)

### MVP Scope:

- [ ] Manage entities (roadmaps, milestones, tasks, adrs, ideas, devlogs)
  - [ ] Create new entity: `zok create task "Senior orc archivist Zok"` // For now without attributes
  - [ ] Change entity status: `zok close task DOD-0005` (also `reopen`, `cancel`) // Now list of commands is fixed. In future it may be customized
  - [ ] Change entity name: `zok rename task DOD-0005 "Zok MVP"`
  - [ ] List entities: `zok list tasks` // For now without filter and pagination
  - [ ] Auto bind active milestones and roadmaps
  - [ ] Change attributes `zok update task 'Milestone:Milestone-002'`
- [ ] Entities must be configured from config files
  - [ ] Directory (`docs/adr`, `docs/devlogs`, ...) // TODO: Think about a scope (README.md + docs)?
  - [ ] Name (`task` / `tasks`, `idea` / `ideas`, ...)
  - [ ] Prefix (`DOD`, `Idea`, `DevLog`, ...) // TODO: Think about tasks with different prefixes
  - [ ] Relations (Roadmap -> Milestone -> Task)
  - [ ] Attributes (`Status`, `Created`, `Milestone`, ...) // For now logic may be fixed. But think about customization
  - [ ] Templates (for ADT: title + attributes + Context + Decision + Consequences)
- [ ] Links
  - [ ] File name generated from name (`Zok MVP` -> `DOD-0005_zok-mvp.md`)
  - [ ] File name changed on entity name change
  - [ ] Zok can generate links for relations
  - [ ] Zok can generate `table of content` for entities and embed it into `README`
  - [ ] If entity has status, it will be rendered differently in `table of content`
  - [ ] If entity status changed, it will change appearance in `table of content` and relations

Think about auto generation from package.json and \*.ts comments
