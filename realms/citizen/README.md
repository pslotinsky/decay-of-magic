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

| Use case | Description |
|----------|-------------|
| [CreateSessionCommand](src/law/commands/create-session.command.ts) | Params: `(payload: CreateSessionDto)`<br>Returns: `SessionDto` |
| [RegisterCitizenCommand](src/law/commands/register-citizen.command.ts) | Params: `(payload: RegisterCitizenDto)`<br>Returns: `CitizenDto` |
| [UpdateCitizenCommand](src/law/commands/update-citizen.command.ts) | Params: `(id: string, payload: UpdateCitizenDto)`<br>Returns: `CitizenDto` |
| [GetCitizenQuery](src/law/queries/get-citizen.query.ts) | Params: `(id: string)`<br>Returns: `CitizenDto` |
| [ListCitizensQuery](src/law/queries/list-citizens.query.ts) | Returns: `CitizenDto[]` |

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
  CitizenRepository --|> EntityRepository
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
    class CitizenRepository
  }
  namespace dod_core {
    class PrismaRepository
  }

  PrismaService --|> PrismaClient
  PrismaCitizenPermitRepository --|> PrismaRepository
  PrismaCitizenPermitRepository ..|> CitizenPermitRepository
  PrismaCitizenPermitRepository *-- PrismaService
  PrismaCitizenPermitRepository --> CitizenPermit
  PrismaCitizenPermitRepository --> Citizen
  PrismaCitizenRepository --|> PrismaRepository
  PrismaCitizenRepository ..|> CitizenRepository
  PrismaCitizenRepository *-- PrismaService
  PrismaCitizenRepository --> Citizen
```

| Entity | Description |
|--------|-------------|
| [PrismaService](src/ground/prisma.service.ts) | Extends `PrismaClient` · Implements `OnModuleInit`, `OnModuleDestroy` |
| repositories/[PrismaCitizenPermitRepository](src/ground/repositories/prisma-citizen-permit.repository.ts) | Extends `PrismaRepository` · Implements [CitizenPermitRepository](src/lore/repositories/citizen-permit.repository.ts) |
| repositories/[PrismaCitizenRepository](src/ground/repositories/prisma-citizen.repository.ts) | Extends `PrismaRepository` · Implements [CitizenRepository](src/lore/repositories/citizen.repository.ts) |
<!-- poe:classes:end -->
