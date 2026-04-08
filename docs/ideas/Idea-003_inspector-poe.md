# Idea-003: Inspector Poe

| Field   | Value      |
| ------- | ---------- |
| Tags    | `tool`     |
| Created | 2026-04-07 |

## Description

Another tool for working with documentation
A melancholic and meticulous Inspector Poe studies the code and organizes the project's structure

### He can

- inspects applications, packages, and services
- finds classes
- analyzes their comments
- determines:
  - implemented interfaces
  - inherited classes
  - used dependencies
- organizes classes by layers
- updates project README files
- inserts tables describing classes
- (future) generates class diagrams

### Bash command example

```sh
poe inspect packages/zok

inspecting zok...
classes found: 23
class table generated
inspection completed: 5s
```

### Generated table example

```markdown
### infrastructure

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [NunjucksScribe](src/infrastructure/assistants/NunjucksScribe.ts) | Scribe Mira. A Nunjucks implementation of abstract Scribe | Extends [Scribe](src/domain/assistants/Scribe.ts) |
```
