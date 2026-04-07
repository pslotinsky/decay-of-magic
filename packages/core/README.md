# @dod/core

<!-- gendoc:class-table:start -->
| Class|File|Description |
| -----|----|----------- |
| EntityRepository|[`src/repositories/entity.repository.ts`](src/repositories/entity.repository.ts)|Abstract base for domain repositories. Defines the standard CRUD contract that all entity repositories must implement. |
| PrismaRepository|[`src/repositories/prisma.repository.ts`](src/repositories/prisma.repository.ts)|Prisma-backed implementation of EntityRepository. Provides getById, find, and save via a model delegate, handling entity↔model mapping via subclasses. |
<!-- gendoc:class-table:end -->
