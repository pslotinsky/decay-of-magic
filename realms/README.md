# Realms

Each realm is an independent microservice with its own domain of responsibility and a name reflecting its fantasy identity.

For a full description of planned realms and entities see [Design-003: Realms mythology](../docs/design/Design-003_realms-mythology.md).

## Active realms

| Realm | Description |
| ----- | ----------- |
| [Codex](codex/README.md) | Game content management — cards, mana, mages, abilities |
| [Citizen](citizen/) | Citizenship registry — player accounts and sessions |
| [Vault](vault/README.md) | File vault — upload, storage, and serving of assets |
| [Gateway](gateway/README.md) | API gateway — routes requests to downstream realms |
