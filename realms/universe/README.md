# universe

<!-- poe:classes:start -->
## Classes

### Frontier

```mermaid
classDiagram
  namespace frontier {
    class HealthGate {
      -HealthCheckService health
      -PrismaHealthIndicator prismaHealth
      -PrismaService prisma
      +check()
    }
    class UniverseGate {
      -CommandBus commandBus
      -QueryBus queryBus
      +create()
      +update()
      +getById()
      +list()
    }
  }
  namespace ground {
    class PrismaService
  }
  namespace law {
    class CreateUniverseCommand {
      +CreateUniverseDto payload
    }
    class UpdateUniverseCommand {
      +string id
      +UpdateUniverseDto payload
    }
    class GetUniverseQuery {
      +string id
    }
    class ListUniversesQuery
  }
  namespace lore {
    class Universe {
      +string id
      +string name
      +string description
      +string cover
    }
  }

  HealthGate *-- PrismaService
  UniverseGate --> CreateUniverseCommand
  UniverseGate --> UpdateUniverseCommand
  UniverseGate --> GetUniverseQuery
  UniverseGate --> ListUniversesQuery
  UniverseGate --> Universe
```

| Entity |
|--------|
| gates/[HealthGate](src/frontier/gates/health.gate.ts) |
| gates/[UniverseGate](src/frontier/gates/universe.gate.ts) |

### Law

```mermaid
classDiagram
  namespace law {
    class CreateUniverseCommand {
      +CreateUniverseDto payload
    }
    class CreateUniverseHandler {
      +execute()
      -assertNameAvailable()
    }
    class UpdateUniverseCommand {
      +string id
      +UpdateUniverseDto payload
    }
    class UpdateUniverseHandler {
      +execute()
      -assertNameAvailable()
    }
    class GetUniverseQuery {
      +string id
    }
    class GetUniverseHandler {
      +execute()
    }
    class ListUniversesQuery
    class ListUniversesHandler {
      +execute()
    }
  }
  namespace lore {
    class Universe {
      +string id
      +string name
      +string description
      +string cover
    }
    class UniverseRepository
  }
  namespace nestjs_cqrs {
    class Command
    class Query
  }

  CreateUniverseCommand --|> Command
  CreateUniverseCommand --> Universe
  CreateUniverseHandler *-- UniverseRepository
  CreateUniverseHandler --> CreateUniverseCommand
  CreateUniverseHandler --> Universe
  UpdateUniverseCommand --|> Command
  UpdateUniverseCommand --> Universe
  UpdateUniverseHandler *-- UniverseRepository
  UpdateUniverseHandler --> UpdateUniverseCommand
  UpdateUniverseHandler --> Universe
  GetUniverseQuery --|> Query
  GetUniverseQuery --> Universe
  GetUniverseHandler *-- UniverseRepository
  GetUniverseHandler --> GetUniverseQuery
  GetUniverseHandler --> Universe
  ListUniversesQuery --|> Query
  ListUniversesQuery --> Universe
  ListUniversesHandler *-- UniverseRepository
  ListUniversesHandler --> ListUniversesQuery
  ListUniversesHandler --> Universe
```

| Entity | Description |
|--------|-------------|
| commands/[CreateUniverseCommand](src/law/commands/create-universe.command.ts) | Extends `Command` |
| commands/[CreateUniverseHandler](src/law/commands/create-universe.command.ts) | Implements `ICommandHandler` |
| commands/[UpdateUniverseCommand](src/law/commands/update-universe.command.ts) | Extends `Command` |
| commands/[UpdateUniverseHandler](src/law/commands/update-universe.command.ts) | Implements `ICommandHandler` |
| queries/[GetUniverseQuery](src/law/queries/get-universe.query.ts) | Extends `Query` |
| queries/[GetUniverseHandler](src/law/queries/get-universe.query.ts) | Implements `IQueryHandler` |
| queries/[ListUniversesQuery](src/law/queries/list-universes.query.ts) | Extends `Query` |
| queries/[ListUniversesHandler](src/law/queries/list-universes.query.ts) | Implements `IQueryHandler` |

### Lore

```mermaid
classDiagram
  namespace lore {
    class Universe {
      +string id
      +string name
      +string description
      +string cover
    }
    class UniverseRepository
  }
  namespace dod_core {
    class Entity
    class EntityRepository
  }

  Universe --|> Entity
  UniverseRepository --|> EntityRepository
  UniverseRepository --> Universe
```

| Entity | Description |
|--------|-------------|
| entities/[Universe](src/lore/entities/universe.entity.ts) | Extends `Entity` |
| repositories/[UniverseRepository](src/lore/repositories/universe.repository.ts) | Abstract · Extends `EntityRepository` |

### Ground

```mermaid
classDiagram
  namespace ground {
    class PrismaService
    class PrismaUniverseRepository {
      #toEntity()
      #toModel()
    }
  }
  namespace lore {
    class Universe {
      +string id
      +string name
      +string description
      +string cover
    }
    class UniverseRepository
  }
  namespace dod_core {
    class PrismaRepository
  }

  PrismaService --|> PrismaClient
  PrismaUniverseRepository --|> PrismaRepository
  PrismaUniverseRepository *-- PrismaService
  PrismaUniverseRepository --> Universe
  PrismaUniverseRepository --> UniverseRepository
```

| Entity | Description |
|--------|-------------|
| [PrismaService](src/ground/prisma.service.ts) | Extends `PrismaClient` · Implements `OnModuleInit`, `OnModuleDestroy` |
| repositories/[PrismaUniverseRepository](src/ground/repositories/prisma-universe.repository.ts) | Extends `PrismaRepository` |
<!-- poe:classes:end -->
