# @dod/core

<!-- poe:classes:start -->
## Classes

```mermaid
classDiagram
  namespace repositories {
    class EntityRepository {
      +getById()
      +getByIdOrFail()
      +find()
      +save()
    }
    class PrismaRepository {
      +getById()
      +getByIdOrFail()
      +find()
      +save()
      #toEntity()
      #toModel()
    }
  }
```

| Entity | Description | Notes |
|--------|-------------|-------|
| repositories/[EntityRepository](src/repositories/entity.repository.ts) | Abstract base for domain repositories. Defines the standard CRUD contract<br>that all entity repositories must implement. | Abstract |
| repositories/[PrismaRepository](src/repositories/prisma.repository.ts) | Prisma-backed implementation of EntityRepository. Provides getById, find,<br>and save via a model delegate, handling entity↔model mapping via subclasses. | Abstract |
<!-- poe:classes:end -->
