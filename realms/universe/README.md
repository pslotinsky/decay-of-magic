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

| Use case | Description |
|----------|-------------|
| [CreateUniverseCommand](src/law/commands/create-universe.command.ts) | Params: `(payload: CreateUniverseDto)`<br>Returns: `UniverseDto`<br><br>Creates a new universe. Fails when the name is already taken |
| [UpdateUniverseCommand](src/law/commands/update-universe.command.ts) | Params: `(id: string, payload: UpdateUniverseDto)`<br>Returns: `UniverseDto`<br><br>Updates an existing universe. Only fields present in the payload<br>are changed. Fails if the new name collides with another universe |
| [GetUniverseQuery](src/law/queries/get-universe.query.ts) | Params: `(id: string)`<br>Returns: `UniverseDto`<br><br>Fetches a single universe by id. Fails when the id is unknown |
| [ListUniversesQuery](src/law/queries/list-universes.query.ts) | Returns: `UniverseDto[]`<br><br>Lists every universe currently registered in the realm |

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
    class UniverseRepository
    class Universe {
      +string id
      +string name
      +string description
      +string cover
    }
  }
  namespace dod_core {
    class PrismaRepository
  }

  PrismaService --|> PrismaClient
  PrismaUniverseRepository --|> PrismaRepository
  PrismaUniverseRepository ..|> UniverseRepository
  PrismaUniverseRepository *-- PrismaService
  PrismaUniverseRepository --> Universe
```

| Entity | Description |
|--------|-------------|
| [PrismaService](src/ground/prisma.service.ts) | Extends `PrismaClient` · Implements `OnModuleInit`, `OnModuleDestroy` |
| repositories/[PrismaUniverseRepository](src/ground/repositories/prisma-universe.repository.ts) | Extends `PrismaRepository` · Implements [UniverseRepository](src/lore/repositories/universe.repository.ts) |
<!-- poe:classes:end -->
