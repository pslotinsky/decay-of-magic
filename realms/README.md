# Realms

Each realm is an independent microservice with its own domain of responsibility and a name reflecting its fantasy identity.

For a full description of planned realms and entities see [Design-003: Realms mythology](../docs/design/Design-003_realms-mythology.md).

## Active realms

<!-- poe:children:start -->
| Realm | Description |
| ----- | ----------- |
| [Citizen](citizen/) | Citizenship registry — player accounts and sessions |
| [Codex](codex/) | Game content management — cards, mana, mages, abilities |
| [Gateway](gateway/) | API gateway — routes requests to downstream realms |
| [Lab](lab/) | Simulation realm — drives the engine to produce balance signal |
| [Universe](universe/) | Game world registry — universes, settings, and ownership boundaries |
| [Vault](vault/) | File vault — upload, storage, and serving of assets |
<!-- poe:children:end -->
