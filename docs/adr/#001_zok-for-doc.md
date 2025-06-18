# ADR #001: Zoc for doc

## Status

Accepted

## Context

I want to keep beautifully organized documentation right in the repository

Among the existing solutions, it was not possible to quickly find a tool that could do everything I wanted. Updating the documentation manually seems like a bad idea

However, some of the libraries and tools can be used in the code or simply used for inspiration:

### List of existing solutions

- Generating a content table for readme https://github.com/thlorenz/doctoc
- Generating readme by package.json https://github.com/kefranabg/readme-md-generator
- Offline wiki https://obsidian.md
- Offline task tracker https://github.com/makeplane/plane
- Tool for working with ADR https://github.com/npryce/adr-tools
- Tool for tasks in the form of todo lists https://github.com/todotxt/todo.txt
- Task tracking from the console (almost what is needed) https://taskwarrior.org
- Auto-generation of documentation https://typedoc.org
- More documentation autogeneration https://documentation.js.org
- More documentation autogeneration https://github.com/jsdoc2md/jsdoc-to-markdown
- Something about building markdown in javascript https://rocket.modern-web.dev/tools/markdown-javascript/overview

### Tasks I would like to solve

- [ ] Task tracking in the repository (tasks, features, roadmaps)
- [ ] Maintaining ideas in the repository
- [ ] Maintaining ARD in the repository
- [ ] Maintaining devlogs in the repository
- [ ] Updating cross-references
- [ ] Creating and updating content tables

## Decision

Entrust this to [senior archivist Zok](../ideas/#001_archivist-zok.md)

## Consequences

### In theory, Zok should solve the following problems:

- Maintaining document numbering
- Putting cross-references in documents (parent entities should display links to child entities)
- Document templating
- Creating a content table in the root directories of the documentation
- Renaming documents (with correction of headings and cross-references)
- Perhaps, I will ask it to collect comments on the code for automatic generation of documentation. Although this already looks a little like a blurring of responsibility. Perhaps Zok will have an assistant
- If you attach a telegram bot, then you will be able to commit tasks to the repository directly from the chat
- In the future, you can even try to learn how to give instructions to Zok via voice messages

### What difficulties may arise:

- This is +1 utility that needs to be written and then supported, which takes away from creating the game itself
- This is a non-standard tool. +1 interface that needs to be kept in mind. But a quick search did not yield any tools that would do everything necessary
