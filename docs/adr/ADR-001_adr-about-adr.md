# ADR-001: ADR about ADR

| Attribute | Value      |
| --------- | ---------- |
| Status    | Accepted   |
| Created   | 2025-06-21 |

## Context

I came across a promising methodology [ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

## Decision

Entrust this to [senior archivist Zok](../ideas/Idea-001_archivist-zok.md)

## Consequences

### In theory, Zok should solve the following problems:

- Maintaining document numbering
- Putting cross-references in documents (e.g. parent documents should link to children)
- Document templating
- Creating a content table in the root directories of the documentation
- Renaming documents (with correction of headings and cross-references)
- Perhaps, I will ask it to collect comments on the code for automatic generation of documentation. Although this might be a case of responsibility creep. Perhaps Zok will have an assistant
- It is possible to add a telegram bot to commit tasks to the repository directly from the chat
- It is even possible to try to learn how to give instructions to Zok via voice messages

### Trade-offs:

- This adds yet another utility that needs to be written and then supported, which takes away from creating the game itself
- This is a non-standard tool. +1 interface that needs to be kept in mind. But a quick search did not yield any tools that would do everything necessary
