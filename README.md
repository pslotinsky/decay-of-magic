# Decay of Magic (DoM)

> Just a pet project: building a card game because why not?

![DoM banner](./docs/assets/banner.jpg "Decay of Magic")

_In this world, magic dies, but battles live on._

## Project structure

```sh
├── apps/           # client applications: council-web, decay-of-magic-web, ...
├── services/       # microservices: codex, battle, vault, ...
├── packages/       # shared libs
├── scripts/        # support scripts: docs generation, ...
└── docs/           # docs, devlogs, ideas, roadmap
```

## Architecture

The architecture follows a microservice-based approach, where each service service has its own domain of responsibility and name reflecting its fantasy identity.

### Microservice mythology

A rough description of the **PLANNED** microservices and entities

#### **1. Codex** — "Repository of Knowledge"

Stores the core content of the game: magic schools, mages, spells, abilities, and effects.

- **MagicSchool** — magic types (Fire, Water, Death, etc.)
- **Mage** — characters players choose to play as
- **Spell** — spells (cards)
- **Ability** — composite elements of actions
- **Effect** — basic game mechanics (damage, healing, etc.)

#### **2. Tournament** — "Tournament Arena"

Handles ranked and competitive matches, matchmaking, and point calculation.

- **Rating** — player rankings
- **Challenge** — duel challenges
- **Matchmaking** — opponent pairing logic

#### **3. Duel** — "Duel Engine"

The heart of the game — manages battles between two mages.

- **Duel** — match state
- **Turns, Slots, Spells** — turn-based logic and actions
- **Creatures** — summoned units

#### **4. Tale** — "Story and Campaign"

Single-player narrative mode. Allows unlocking cards, artifacts, and unique conditions.

- **Chapter** — campaign chapters
- **Mission** — individual story missions
- **Progress** — player’s campaign progress

#### **5. Lab** — "Balance Lab"

Performs balancing analysis, simulates matches, and compares theoretical vs real-world performance.

- **Simulation** — automated duel simulations
- **Analyzer** — analytics of historical games

#### **6. Citizen** — "Citizenship Registry"

User management service. May later include authentication and profile management.

- **User** — registered player
- **Profile** — preferences and settings

#### **7. Vault** — "Asset Vault"

Manages files: upload, storage, image resizing, and compression.

- **Asset** — card images, animations, avatars

#### **8. Chronicle** — "Chronicle of Events"

Stores audit logs and tracks all key actions across the system.

- **EventLog** — structured logs of changes and activities

---
