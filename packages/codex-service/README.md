# Codex service

Game content management service

## Entities

| Entity           | Description                                                                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Card**         | Spells and creatures. Each card belongs to one magic school and may have multiple abilities.                                                                     |
| **Ability**      | Actions a card can perform. Composed of one or more effects. Supports conditional triggers                                                                       |
| **Effect**       | Atomic action within an ability (damage, heal, buff/debuff)                                                                                                      |
| **Mage**         | Playable character specializing in a magic school. Determines starting cards and unique perks                                                                    |
| **Magic school** | • **Core Schools**: Fire, Water, Earth, Air (common for all mages)<br>• **Advanced Schools**: Necromancy, Demonology, Chaos, etc (specific to a particular mage) |
