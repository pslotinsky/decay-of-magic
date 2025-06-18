# Idea 001: Archivist Zok

## Description

Make a documentation assistant. Senior orc archivist Zok

<img src="images/zok.jpg" alt="Senior orc archivist Zok" width="200"/>

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
