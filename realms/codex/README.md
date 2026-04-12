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

### frontier

```mermaid
classDiagram
  namespace frontier {
    class CreateCardDto {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class CreateManaDto {
      +string id
      +string name
      +ManaType type
    }
    class CardDto {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class ManaDto {
      +string id
      +string name
      +ManaType type
    }
    class CardGate {
      -CommandBus commandBus
      -QueryBus queryBus
      +create()
      +getById()
      +find()
    }
    class ManaGate {
      -CommandBus commandBus
      -QueryBus queryBus
      +create()
      +getById()
      +find()
    }
  }
  namespace lore {
    class Mana {
      +string id
      +string name
      +ManaType type
    }
    class Card {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
  }
  namespace law {
    class CreateCardCommand {
      +CreateCardDto payload
    }
    class FindCardsQuery
    class GetCardQuery {
      +string id
    }
    class CreateManaCommand {
      +CreateManaDto payload
    }
    class FindManaQuery
    class GetManaQuery {
      +string id
    }
  }

  CreateManaDto --> Mana
  ManaDto --> Mana
  CardGate --> CreateCardDto
  CardGate --> CardDto
  CardGate --> CreateCardCommand
  CardGate --> FindCardsQuery
  CardGate --> GetCardQuery
  CardGate --> Card
  ManaGate --> CreateManaDto
  ManaGate --> ManaDto
  ManaGate --> CreateManaCommand
  ManaGate --> FindManaQuery
  ManaGate --> GetManaQuery
  ManaGate --> Mana
```

| Entity |
|--------|
| dto/body/[CreateCardDto](src/frontier/dto/body/create-card.dto.ts) |
| dto/body/[CreateManaDto](src/frontier/dto/body/create-mana.dto.ts) |
| dto/[CardDto](src/frontier/dto/card.dto.ts) |
| dto/[ManaDto](src/frontier/dto/mana.dto.ts) |
| gates/[CardGate](src/frontier/gates/card.gate.ts) |
| gates/[ManaGate](src/frontier/gates/mana.gate.ts) |

### ground

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

| Entity | Notes |
|--------|-------|
| [PrismaService](src/ground/prisma.service.ts) | Extends `PrismaClient` · Implements `OnModuleInit`, `OnModuleDestroy` |
| repositories/[PrismaCardRepository](src/ground/repositories/prisma-card.repository.ts) | Extends `PrismaRepository` |
| repositories/[PrismaManaRepository](src/ground/repositories/prisma-mana.repository.ts) | Extends `PrismaRepository` |

### law

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
    class FindCardsQuery
    class FindCardsHandler {
      +execute()
    }
    class FindManaQuery
    class FindManaHandler {
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
  }
  namespace frontier {
    class CreateCardDto {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class CardDto {
      +string id
      +string name
      +string imageUrl
      +string description
      +number level
      +number cost
      +string manaId
    }
    class CreateManaDto {
      +string id
      +string name
      +ManaType type
    }
    class ManaDto {
      +string id
      +string name
      +ManaType type
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
    class Query
  }

  CreateCardCommand *-- CreateCardDto
  CreateCardCommand --> CardDto
  CreateCardCommand --> Card
  CreateCardHandler *-- CardRepository
  CreateCardHandler --> CreateCardCommand
  CreateCardHandler --> Card
  CreateManaCommand *-- CreateManaDto
  CreateManaCommand --> ManaDto
  CreateManaCommand --> Mana
  CreateManaHandler *-- ManaRepository
  CreateManaHandler --> CreateManaCommand
  CreateManaHandler --> Mana
  FindCardsQuery --|> Query
  FindCardsQuery --> Card
  FindCardsHandler *-- CardRepository
  FindCardsHandler --> FindCardsQuery
  FindCardsHandler --> Card
  FindManaQuery --|> Query
  FindManaQuery --> Mana
  FindManaHandler *-- ManaRepository
  FindManaHandler --> FindManaQuery
  FindManaHandler --> Mana
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
```

| Entity | Notes |
|--------|-------|
| commands/[CreateCardCommand](src/law/commands/create-card.command.ts) |  |
| commands/[CreateCardHandler](src/law/commands/create-card.command.ts) | Implements `ICommandHandler` |
| commands/[CreateManaCommand](src/law/commands/create-mana.command.ts) |  |
| commands/[CreateManaHandler](src/law/commands/create-mana.command.ts) | Implements `ICommandHandler` |
| queries/[FindCardsQuery](src/law/queries/find-cards.query.ts) | Extends `Query` |
| queries/[FindCardsHandler](src/law/queries/find-cards.query.ts) | Implements `IQueryHandler` |
| queries/[FindManaQuery](src/law/queries/find-mana.query.ts) | Extends `Query` |
| queries/[FindManaHandler](src/law/queries/find-mana.query.ts) | Implements `IQueryHandler` |
| queries/[GetCardQuery](src/law/queries/get-card.query.ts) | Extends `Query` |
| queries/[GetCardHandler](src/law/queries/get-card.query.ts) | Implements `IQueryHandler` |
| queries/[GetManaQuery](src/law/queries/get-mana.query.ts) | Extends `Query` |
| queries/[GetManaHandler](src/law/queries/get-mana.query.ts) | Implements `IQueryHandler` |

### lore

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

| Entity | Description | Notes |
|--------|-------------|-------|
| entities/[Card](src/lore/entities/card.entity.ts) | Spells and creatures. Each card belongs to one mana and may have multiple abilities |  |
| entities/[Mana](src/lore/entities/mana.entity.ts) | • Core mana: Fire, Water, Earth, Air (common for all mages)<br>• Special mana: Necromancy, Demonology, Chaos, etc (specific to a particular mage) |  |
| repositories/[CardRepository](src/lore/repositories/card.repository.ts) |  | Abstract · Extends `EntityRepository` |
| repositories/[ManaRepository](src/lore/repositories/mana.repository.ts) |  | Abstract · Extends `EntityRepository` |

### root

```mermaid
classDiagram
  namespace root {
    class AppModule
  }
```

| Entity |
|--------|
| [AppModule](src/app.module.ts) |
<!-- poe:classes:end -->
