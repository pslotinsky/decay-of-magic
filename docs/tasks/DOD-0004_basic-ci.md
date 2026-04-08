# DOD-0004: Basic CI

| Field     | Value                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------- |
| Status    | Done                                                                                                |
| Milestone | [Infrastructure and documentation](../milestones/Milestone-001_infrastructure-and-documentation.md) |
| Created   | 2025-06-21                                                                                          |

## Description

On pull request:
- build
- lint
- typecheck
- format
- test

### Documentation auto generation

```sh
poe inspect <path>
```

- Recursively scans `<path>/src/**/*.ts` (excludes `.spec.ts` and `.d.ts`)
- Extracts the first JSDoc comment above each `class` declaration
- Writes a Markdown table into `<path>/README.md` between `<!-- poe:class-table:start -->` / `<!-- poe:class-table:end -->` markers
- Creates `README.md` if it does not exist, using the package name as the heading
