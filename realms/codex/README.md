# Codex service

Game content management service

## Entities

| Entity      | Description                                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Card**    | Spells and creatures. Each card belongs to one mana and may have multiple abilities.                                                                      |
| **Ability** | Actions a card can perform. Composed of one or more effects. Supports conditional triggers                                                                |
| **Effect**  | Atomic action within an ability (damage, heal, buff/debuff)                                                                                               |
| **Mage**    | Playable character specializing in a mana. Determines starting cards and unique perks                                                                     |
| **Mana**    | • **Core mana**: Fire, Water, Earth, Air (common for all mages)<br>• **Special mana**: Necromancy, Demonology, Chaos, etc (specific to a particular mage) |

## Bash commands

```bash
# Connect to the database
psql -h 127.0.0.1 -U ruler -d codex

# Generate a migration
npm run prisma:generate migration_name

# Apply migrations to dev DB
npm run prisma:migrate:dev
```

<!-- poe:classes:start -->
## Classes

### Frontier

```mermaid
classDiagram
  namespace frontier {
    class CardGate {
      -CommandBus commandBus
      -QueryBus queryBus
      +create()
      +getById()
      +list()
    }
    class HealthGate {
      -HealthCheckService health
      -PrismaHealthIndicator prismaHealth
      -PrismaService prisma
      +check()
    }
    class ManaGate {
      -CommandBus commandBus
      -QueryBus queryBus
      +create()
      +getById()
      +list()
    }
  }
  namespace law {
    class CreateCardCommand {
      +CreateCardDto payload
    }
    class GetCardQuery {
      +string id
    }
    class ListCardsQuery
    class CreateManaCommand {
      +CreateManaDto payload
    }
    class GetManaQuery {
      +string id
    }
    class ListManaQuery
  }
  namespace lore {
    class Card {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class Mana {
      +string id
      +string name
      +ManaType type
    }
  }
  namespace ground {
    class PrismaService
  }

  CardGate --> CreateCardCommand
  CardGate --> GetCardQuery
  CardGate --> ListCardsQuery
  CardGate --> Card
  HealthGate *-- PrismaService
  ManaGate --> CreateManaCommand
  ManaGate --> GetManaQuery
  ManaGate --> ListManaQuery
  ManaGate --> Mana
```

| Entity |
|--------|
| gates/[CardGate](src/frontier/gates/card.gate.ts) |
| gates/[HealthGate](src/frontier/gates/health.gate.ts) |
| gates/[ManaGate](src/frontier/gates/mana.gate.ts) |

### Law

```mermaid
classDiagram
  namespace law {
    class CreateCardCommand {
      +CreateCardDto payload
    }
    class CreateCardHandler {
      +execute()
    }
    class CreateManaCommand {
      +CreateManaDto payload
    }
    class CreateManaHandler {
      +execute()
    }
    class GetCardQuery {
      +string id
    }
    class GetCardHandler {
      +execute()
    }
    class GetManaQuery {
      +string id
    }
    class GetManaHandler {
      +execute()
    }
    class ListCardsQuery
    class ListCardsHandler {
      +execute()
    }
    class ListManaQuery
    class ListManaHandler {
      +execute()
    }
  }
  namespace lore {
    class Card {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class CardRepository
    class Mana {
      +string id
      +string name
      +ManaType type
    }
    class ManaRepository
  }
  namespace nestjs_cqrs {
    class Command
    class Query
  }

  CreateCardCommand --|> Command
  CreateCardCommand --> Card
  CreateCardHandler *-- CardRepository
  CreateCardHandler --> CreateCardCommand
  CreateCardHandler --> Card
  CreateManaCommand --|> Command
  CreateManaCommand --> Mana
  CreateManaHandler *-- ManaRepository
  CreateManaHandler --> CreateManaCommand
  CreateManaHandler --> Mana
  GetCardQuery --|> Query
  GetCardQuery --> Card
  GetCardHandler *-- CardRepository
  GetCardHandler --> GetCardQuery
  GetCardHandler --> Card
  GetManaQuery --|> Query
  GetManaQuery --> Mana
  GetManaHandler *-- ManaRepository
  GetManaHandler --> GetManaQuery
  GetManaHandler --> Mana
  ListCardsQuery --|> Query
  ListCardsQuery --> Card
  ListCardsHandler *-- CardRepository
  ListCardsHandler --> ListCardsQuery
  ListCardsHandler --> Card
  ListManaQuery --|> Query
  ListManaQuery --> Mana
  ListManaHandler *-- ManaRepository
  ListManaHandler --> ListManaQuery
  ListManaHandler --> Mana
```

| Entity | Description |
|--------|-------------|
| commands/[CreateCardCommand](src/law/commands/create-card.command.ts) | Extends `Command` |
| commands/[CreateCardHandler](src/law/commands/create-card.command.ts) | Implements `ICommandHandler` |
| commands/[CreateManaCommand](src/law/commands/create-mana.command.ts) | Extends `Command` |
| commands/[CreateManaHandler](src/law/commands/create-mana.command.ts) | Implements `ICommandHandler` |
| queries/[GetCardQuery](src/law/queries/get-card.query.ts) | Extends `Query` |
| queries/[GetCardHandler](src/law/queries/get-card.query.ts) | Implements `IQueryHandler` |
| queries/[GetManaQuery](src/law/queries/get-mana.query.ts) | Extends `Query` |
| queries/[GetManaHandler](src/law/queries/get-mana.query.ts) | Implements `IQueryHandler` |
| queries/[ListCardsQuery](src/law/queries/list-cards.query.ts) | Extends `Query` |
| queries/[ListCardsHandler](src/law/queries/list-cards.query.ts) | Implements `IQueryHandler` |
| queries/[ListManaQuery](src/law/queries/list-mana.query.ts) | Extends `Query` |
| queries/[ListManaHandler](src/law/queries/list-mana.query.ts) | Implements `IQueryHandler` |

### Lore

```mermaid
classDiagram
  namespace lore {
    class Card {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class Mana {
      +string id
      +string name
      +ManaType type
    }
    class CardRepository
    class ManaRepository
  }
  namespace dod_core {
    class EntityRepository
  }

  CardRepository --|> EntityRepository
  CardRepository --> Card
  ManaRepository --|> EntityRepository
  ManaRepository --> Mana
```

| Entity | Description |
|--------|-------------|
| entities/[Card](src/lore/entities/card.entity.ts) | Spells and creatures. Each card belongs to one mana and may have multiple abilities |
| entities/[Mana](src/lore/entities/mana.entity.ts) | • Core mana: Fire, Water, Earth, Air (common for all mages)<br>• Special mana: Necromancy, Demonology, Chaos, etc (specific to a particular mage) |
| repositories/[CardRepository](src/lore/repositories/card.repository.ts) | Abstract · Extends `EntityRepository` |
| repositories/[ManaRepository](src/lore/repositories/mana.repository.ts) | Abstract · Extends `EntityRepository` |

### Ground

```mermaid
classDiagram
  namespace ground {
    class PrismaService
    class PrismaCardRepository {
      #toEntity()
      #toModel()
    }
    class PrismaManaRepository {
      #toEntity()
      #toModel()
    }
  }
  namespace lore {
    class Card {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class CardRepository
    class Mana {
      +string id
      +string name
      +ManaType type
    }
    class ManaRepository
  }
  namespace dod_core {
    class PrismaRepository
  }

  PrismaService --|> PrismaClient
  PrismaCardRepository --|> PrismaRepository
  PrismaCardRepository *-- PrismaService
  PrismaCardRepository --> Card
  PrismaCardRepository --> CardRepository
  PrismaManaRepository --|> PrismaRepository
  PrismaManaRepository *-- PrismaService
  PrismaManaRepository --> Mana
  PrismaManaRepository --> ManaRepository
```

| Entity | Description |
|--------|-------------|
| [PrismaService](src/ground/prisma.service.ts) | Extends `PrismaClient` · Implements `OnModuleInit`, `OnModuleDestroy` |
| repositories/[PrismaCardRepository](src/ground/repositories/prisma-card.repository.ts) | Extends `PrismaRepository` |
| repositories/[PrismaManaRepository](src/ground/repositories/prisma-mana.repository.ts) | Extends `PrismaRepository` |
<!-- poe:classes:end -->
