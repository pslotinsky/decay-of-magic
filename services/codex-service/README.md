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

## Classes

<!-- poe:class-table:start -->
### api

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [CardController](src/api/controllers/card.controller.ts) |  |  |
| [ManaController](src/api/controllers/mana.controller.ts) |  |  |
| [CreateCardDto](src/api/dto/body/create-card.dto.ts) |  |  |
| [CreateManaDto](src/api/dto/body/create-mana.dto.ts) |  |  |
| [CardDto](src/api/dto/card.dto.ts) |  |  |
| [ManaDto](src/api/dto/mana.dto.ts) |  |  |

### root

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [AppModule](src/app.module.ts) |  |  |

### application

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [CreateCardCommand](src/application/commands/create-card.command.ts) |  |  |
| [CreateCardHandler](src/application/commands/create-card.command.ts) |  | Implements ICommandHandler |
| [CreateManaCommand](src/application/commands/create-mana.command.ts) |  |  |
| [CreateManaHandler](src/application/commands/create-mana.command.ts) |  | Implements ICommandHandler |
| [FindCardsQuery](src/application/queries/find-cards.query.ts) |  | Extends Query |
| [FindCardsHandler](src/application/queries/find-cards.query.ts) |  | Implements IQueryHandler |
| [FindManaQuery](src/application/queries/find-mana.query.ts) |  | Extends Query |
| [FindManaHandler](src/application/queries/find-mana.query.ts) |  | Implements IQueryHandler |
| [GetCardQuery](src/application/queries/get-card.query.ts) |  | Extends Query |
| [GetCardHandler](src/application/queries/get-card.query.ts) |  | Implements IQueryHandler |
| [GetManaQuery](src/application/queries/get-mana.query.ts) |  | Extends Query |
| [GetManaHandler](src/application/queries/get-mana.query.ts) |  | Implements IQueryHandler |

### domain

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [Card](src/domain/entities/card.entity.ts) |  |  |
| [Mana](src/domain/entities/mana.entity.ts) |  |  |
| [CardRepository](src/domain/repositories/card.repository.ts) |  | Abstract · Extends EntityRepository |
| [ManaRepository](src/domain/repositories/mana.repository.ts) |  | Abstract · Extends EntityRepository |

### infrastructure

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [PrismaService](src/infrastructure/prisma/prisma.service.ts) |  | Extends PrismaClient · Implements OnModuleInit, OnModuleDestroy |
| [PrismaCardRepository](src/infrastructure/repositories/prisma-card.repository.ts) |  | Extends PrismaRepository |
| [PrismaManaRepository](src/infrastructure/repositories/prisma-mana.repository.ts) |  | Extends PrismaRepository |
<!-- poe:class-table:end -->
