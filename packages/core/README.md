# @dod/core

<!-- poe:class-table:start -->
### repositories

| Entity | Description | Notes |
|--------|-------------|-------|
| [EntityRepository](src/repositories/entity.repository.ts) | Abstract base for domain repositories. Defines the standard CRUD contract<br>that all entity repositories must implement. | Abstract |
| [PrismaRepository](src/repositories/prisma.repository.ts) | Prisma-backed implementation of EntityRepository. Provides getById, find,<br>and save via a model delegate, handling entity↔model mapping via subclasses. | Abstract |
<!-- poe:class-table:end -->
