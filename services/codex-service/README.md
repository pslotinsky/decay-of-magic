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
| Class|File|Description |
| -----|----|----------- |
| CardController|[`src/api/controllers/card.controller.ts`](src/api/controllers/card.controller.ts)| |
| ManaController|[`src/api/controllers/mana.controller.ts`](src/api/controllers/mana.controller.ts)| |
| CreateCardDto|[`src/api/dto/body/create-card.dto.ts`](src/api/dto/body/create-card.dto.ts)| |
| CreateManaDto|[`src/api/dto/body/create-mana.dto.ts`](src/api/dto/body/create-mana.dto.ts)| |
| CardDto|[`src/api/dto/card.dto.ts`](src/api/dto/card.dto.ts)| |
| ManaDto|[`src/api/dto/mana.dto.ts`](src/api/dto/mana.dto.ts)| |
| AppModule|[`src/app.module.ts`](src/app.module.ts)| |
| CreateCardCommand|[`src/application/commands/create-card.command.ts`](src/application/commands/create-card.command.ts)| |
| CreateCardHandler|[`src/application/commands/create-card.command.ts`](src/application/commands/create-card.command.ts)| |
| CreateManaCommand|[`src/application/commands/create-mana.command.ts`](src/application/commands/create-mana.command.ts)| |
| CreateManaHandler|[`src/application/commands/create-mana.command.ts`](src/application/commands/create-mana.command.ts)| |
| FindCardsQuery|[`src/application/queries/find-cards.query.ts`](src/application/queries/find-cards.query.ts)| |
| FindCardsHandler|[`src/application/queries/find-cards.query.ts`](src/application/queries/find-cards.query.ts)| |
| FindManaQuery|[`src/application/queries/find-mana.query.ts`](src/application/queries/find-mana.query.ts)| |
| FindManaHandler|[`src/application/queries/find-mana.query.ts`](src/application/queries/find-mana.query.ts)| |
| GetCardQuery|[`src/application/queries/get-card.query.ts`](src/application/queries/get-card.query.ts)| |
| GetCardHandler|[`src/application/queries/get-card.query.ts`](src/application/queries/get-card.query.ts)| |
| GetManaQuery|[`src/application/queries/get-mana.query.ts`](src/application/queries/get-mana.query.ts)| |
| GetManaHandler|[`src/application/queries/get-mana.query.ts`](src/application/queries/get-mana.query.ts)| |
| Card|[`src/domain/entities/card.entity.ts`](src/domain/entities/card.entity.ts)| |
| Mana|[`src/domain/entities/mana.entity.ts`](src/domain/entities/mana.entity.ts)| |
| CardRepository|[`src/domain/repositories/card.repository.ts`](src/domain/repositories/card.repository.ts)| |
| ManaRepository|[`src/domain/repositories/mana.repository.ts`](src/domain/repositories/mana.repository.ts)| |
| PrismaService|[`src/infrastructure/prisma/prisma.service.ts`](src/infrastructure/prisma/prisma.service.ts)| |
| PrismaCardRepository|[`src/infrastructure/repositories/prisma-card.repository.ts`](src/infrastructure/repositories/prisma-card.repository.ts)| |
| PrismaManaRepository|[`src/infrastructure/repositories/prisma-mana.repository.ts`](src/infrastructure/repositories/prisma-mana.repository.ts)| |
<!-- poe:class-table:end -->
