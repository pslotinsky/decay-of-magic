# citizen

## CLI

Run administrative commands via the NestJS application context (requires `DATABASE_URL` in `.env` or environment):

```bash
npm run cli -- <command> [options]
```

### Commands

#### `citizen:create`

Register a new citizen with a hashed password.

```bash
npm run cli -- citizen:create --nickname <name> --password <secret>
```

| Option | Required | Description |
|--------|----------|-------------|
| `--nickname` | yes | Citizen nickname |
| `--password` | yes | Citizen password (min 8 characters) |

<!-- poe:classes:start -->
## Classes

### Frontier

```mermaid
classDiagram
  namespace frontier {
    class CitizenGate {
      -CommandBus commandBus
      -QueryBus queryBus
      +register()
      +update()
      +getById()
      +list()
    }
    class HealthGate {
      -HealthCheckService health
      -PrismaHealthIndicator prismaHealth
      -PrismaService prisma
      +check()
    }
    class SessionGate {
      -CommandBus commandBus
      +create()
    }
  }
  namespace law {
    class RegisterCitizenCommand {
      +RegisterCitizenDto payload
    }
    class UpdateCitizenCommand {
      +string id
      +UpdateCitizenDto payload
    }
    class GetCitizenQuery {
      +string id
    }
    class ListCitizensQuery
    class CreateSessionCommand {
      +CreateSessionDto payload
    }
  }
  namespace lore {
    class Citizen {
      +string id
      +string nickname
    }
  }
  namespace ground {
    class PrismaService
  }

  CitizenGate --> RegisterCitizenCommand
  CitizenGate --> UpdateCitizenCommand
  CitizenGate --> GetCitizenQuery
  CitizenGate --> ListCitizensQuery
  CitizenGate --> Citizen
  HealthGate *-- PrismaService
  SessionGate --> CreateSessionCommand
```

| Entity |
|--------|
| gates/[CitizenGate](src/frontier/gates/citizen.gate.ts) |
| gates/[HealthGate](src/frontier/gates/health.gate.ts) |
| gates/[SessionGate](src/frontier/gates/session.gate.ts) |

### Law

```mermaid
classDiagram
  namespace law {
    class CreateSessionCommand {
      +CreateSessionDto payload
    }
    class CreateSessionHandler {
      +execute()
      -findCitizenByNickname()
      -loadPermit()
      -verifySecret()
    }
    class RegisterCitizenCommand {
      +RegisterCitizenDto payload
    }
    class RegisterCitizenHandler {
      +execute()
      -assertNicknameAvailable()
    }
    class UpdateCitizenCommand {
      +string id
      +UpdateCitizenDto payload
    }
    class UpdateCitizenHandler {
      +execute()
    }
    class GetCitizenQuery {
      +string id
    }
    class GetCitizenHandler {
      +execute()
    }
    class ListCitizensQuery
    class ListCitizensHandler {
      +execute()
    }
  }
  namespace lore {
    class CitizenRepository
    class CitizenPermitRepository
    class CitizenPermit {
      +string id
      +string secret
      +Date issuedAt
    }
    class Citizen {
      +string id
      +string nickname
    }
  }
  namespace nestjs_cqrs {
    class Command
    class Query
  }

  CreateSessionCommand --|> Command
  CreateSessionHandler *-- CitizenRepository
  CreateSessionHandler *-- CitizenPermitRepository
  CreateSessionHandler --> CreateSessionCommand
  CreateSessionHandler --> CitizenPermit
  CreateSessionHandler --> Citizen
  RegisterCitizenCommand --|> Command
  RegisterCitizenCommand --> Citizen
  RegisterCitizenHandler *-- CitizenRepository
  RegisterCitizenHandler *-- CitizenPermitRepository
  RegisterCitizenHandler --> RegisterCitizenCommand
  RegisterCitizenHandler --> CitizenPermit
  RegisterCitizenHandler --> Citizen
  UpdateCitizenCommand --|> Command
  UpdateCitizenCommand --> Citizen
  UpdateCitizenHandler *-- CitizenRepository
  UpdateCitizenHandler --> UpdateCitizenCommand
  UpdateCitizenHandler --> Citizen
  GetCitizenQuery --|> Query
  GetCitizenQuery --> Citizen
  GetCitizenHandler *-- CitizenRepository
  GetCitizenHandler --> GetCitizenQuery
  GetCitizenHandler --> Citizen
  ListCitizensQuery --|> Query
  ListCitizensQuery --> Citizen
  ListCitizensHandler *-- CitizenRepository
  ListCitizensHandler --> ListCitizensQuery
  ListCitizensHandler --> Citizen
```

| Entity | Description |
|--------|-------------|
| commands/[CreateSessionCommand](src/law/commands/create-session.command.ts) | Extends `Command` |
| commands/[CreateSessionHandler](src/law/commands/create-session.command.ts) | Implements `ICommandHandler` |
| commands/[RegisterCitizenCommand](src/law/commands/register-citizen.command.ts) | Extends `Command` |
| commands/[RegisterCitizenHandler](src/law/commands/register-citizen.command.ts) | Implements `ICommandHandler` |
| commands/[UpdateCitizenCommand](src/law/commands/update-citizen.command.ts) | Extends `Command` |
| commands/[UpdateCitizenHandler](src/law/commands/update-citizen.command.ts) | Implements `ICommandHandler` |
| queries/[GetCitizenQuery](src/law/queries/get-citizen.query.ts) | Extends `Query` |
| queries/[GetCitizenHandler](src/law/queries/get-citizen.query.ts) | Implements `IQueryHandler` |
| queries/[ListCitizensQuery](src/law/queries/list-citizens.query.ts) | Extends `Query` |
| queries/[ListCitizensHandler](src/law/queries/list-citizens.query.ts) | Implements `IQueryHandler` |

### Lore

```mermaid
classDiagram
  namespace lore {
    class CitizenPermit {
      +string id
      +string secret
      +Date issuedAt
    }
    class Citizen {
      +string id
      +string nickname
    }
    class CitizenPermitRepository
    class CitizenRepository
  }
  namespace dod_core {
    class Entity
    class EntityRepository
  }

  CitizenPermit --> Citizen
  Citizen --|> Entity
  CitizenPermitRepository --|> EntityRepository
  CitizenPermitRepository --> CitizenPermit
  CitizenPermitRepository --> Citizen
  CitizenRepository --|> EntityRepository
  CitizenRepository --> Citizen
```

| Entity | Description |
|--------|-------------|
| entities/[CitizenPermit](src/lore/entities/citizen-permit.entity.ts) |  |
| entities/[Citizen](src/lore/entities/citizen.entity.ts) | Extends `Entity` |
| repositories/[CitizenPermitRepository](src/lore/repositories/citizen-permit.repository.ts) | Abstract · Extends `EntityRepository` |
| repositories/[CitizenRepository](src/lore/repositories/citizen.repository.ts) | Abstract · Extends `EntityRepository` |

### Ground

```mermaid
classDiagram
  namespace ground {
    class PrismaService
    class PrismaCitizenPermitRepository {
      #toEntity()
      #toModel()
    }
    class PrismaCitizenRepository {
      #toEntity()
      #toModel()
    }
  }
  namespace lore {
    class CitizenPermit {
      +string id
      +string secret
      +Date issuedAt
    }
    class Citizen {
      +string id
      +string nickname
    }
    class CitizenPermitRepository
    class CitizenRepository
  }
  namespace dod_core {
    class PrismaRepository
  }

  PrismaService --|> PrismaClient
  PrismaCitizenPermitRepository --|> PrismaRepository
  PrismaCitizenPermitRepository *-- PrismaService
  PrismaCitizenPermitRepository --> CitizenPermit
  PrismaCitizenPermitRepository --> Citizen
  PrismaCitizenPermitRepository --> CitizenPermitRepository
  PrismaCitizenRepository --|> PrismaRepository
  PrismaCitizenRepository *-- PrismaService
  PrismaCitizenRepository --> Citizen
  PrismaCitizenRepository --> CitizenRepository
```

| Entity | Description |
|--------|-------------|
| [PrismaService](src/ground/prisma.service.ts) | Extends `PrismaClient` · Implements `OnModuleInit`, `OnModuleDestroy` |
| repositories/[PrismaCitizenPermitRepository](src/ground/repositories/prisma-citizen-permit.repository.ts) | Extends `PrismaRepository` |
| repositories/[PrismaCitizenRepository](src/ground/repositories/prisma-citizen.repository.ts) | Extends `PrismaRepository` |
<!-- poe:classes:end -->
