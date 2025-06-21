# Idea-001: Archivist Zok

| Field   | Value                 |
| ------- | --------------------- |
| Tags    | `cool`, `tool`, `Zok` |
| Created | 2025-06-18            |

## Description

Make a documentation assistant. Senior orc archivist Zok

### He can:

- Create and manage entities (ideas, tasks, features, roadmaps)
- Configure them (how the numbering is done, how the entities are connected, what fields they have, etc.)
- Update linked entities (render lists, show statuses, etc.)
- Search for entities / display lists
- There should also be a bot in Telegram for him, which you can write to and ask to do something. Must think about authorization. Most likely just configure a list of authorized users

### Bash command examples

- Master: `zok create task "Create archivist Zok"`
- Zok:

```sh
Okay, master. I created the task "docs/tasks/MVP-0001_create-archivist-zok.md" and linked it to the feature "docs/features/#001_documentation.md"
```

---

- Master: `zok list tasks`
- Zok:

```sh
*Sigh* As you wish:
- "docs/tasks/MVP-0001_create-archivist-zok.md"
- "docs/tasks/MVP-0002_add-documentation-autogeneration.md"
...
```

---

- Master: `zok close task MVP-0001`
- Zok:

```sh
With pleasure. Task "docs/tasks/MVP-0001_create-archivist-zok.md" is closed
```

The task status will be changed in the parent feature

```markdown
# Feature 001: Documentation

Make cool documentation

## Tasks

- [x] MVP-0001: Create archivist Zok
- [ ] MVP-0002: Add documentation autogeneration
```

## Zok's personality

This is an elderly orc with the status of an archivist. He is significantly smarter than his visitors and knows it for sure. But he is forced to humbly endure their stupid wishes. Despite this, he always fulfills them exactly, and is never wrong. However, his tired face always shows that he does not think much of you. He could hide it, but he does not consider it necessary

<img src="../assets/zok.jpg" alt="Senior orc archivist Zok" width="200"/>

## Offtop

- All documentation root folders should have a README with a table of contents.
- A future task is to generate links from other documents, something like `<zok:link>Idea #001</zok:link>`. (UPD. There is no need for a metalanguage, Zok knows perfectly well what everything is called and can rename it everywhere)
- The task of the distant future is to analyze voice messages and act accordingly (Ah-hah. Poor Zok. Could he hate me any more?)
