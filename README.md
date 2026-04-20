# Decay of Magic (DoM)

> Just a pet project: building a card game because why not?

![DoM banner](./docs/assets/banner.jpg "Decay of Magic")

_In this world, magic dies, but battles live on._

## Project structure

```sh
├── apps/           # client applications: council-web, ...
├── realms/         # microservices: gateway, citizen, universe, codex, vault, ...
├── packages/       # shared libs: @dod/core, @dod/api-contract, @dod/poe, zok, @dod/config
└── docs/           # roadmaps, milestones, tasks, adr, designs, ideas, devlogs
```

## Getting started

```sh
docker-compose up -d --build
```

## Documentation

- [Road maps](./docs/roadmaps/README.md)
- [Milestones](./docs/milestones/README.md)
- [Tasks](./docs/tasks/README.md)
- [ADRs](./docs/adr/README.md)
- [Designs](./docs/design/README.md)
- [Ideas](./docs/ideas/README.md)
- [Dev logs](./docs/devlogs/README.md)

## Technologies used

- 🎮 Frontend: React + Vite
- ⚙️ Backend: REST, PostgreSQL, Redis, NestJS
- 🐳 Docker
