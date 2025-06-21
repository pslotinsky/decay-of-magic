# Architecture

The architecture follows a microservice-based approach, where each service service has its own domain of responsibility and name reflecting its fantasy identity.

## Microservice mythology

A rough description of the **PLANNED** microservices and entities

### **1. Codex** — "Repository of Knowledge"

Stores the core content of the game: magic schools, mages, spells, abilities, and effects.

- **Force** — force sources (Fire, Water, Death, etc.)
- **Hero** — characters players choose to play as
- **Card** — cards (spells, etc.)
- **Ability** — composite elements of actions
- **Effect** — basic game mechanics (battle, visual, sound, etc.)

### **2. Tournament** — "Tournament Arena"

Handles ranked and competitive matches, matchmaking, and point calculation.

- **Rating** — player rankings
- **Challenge** — duel challenges
- **Matchmaking** — opponent pairing logic

### **3. Battle** — "Battle Engine"

The heart of the game — manages battles between two mages.

- **Battle** — match state
- **Turns, Slots, Spells** — turn-based logic and actions
- **Creatures** — summoned units

### **4. Story** — "Story and Campaign"

Single-player narrative mode. Allows unlocking cards, artifacts, and unique conditions.

- **Chapter** — campaign chapters
- **Mission** — individual story missions
- **Progress** — player’s campaign progress

### **5. Lab** — "Balance Lab"

Performs balancing analysis, simulates matches, and compares theoretical vs real-world performance.

- **Simulation** — automated duel simulations
- **Analyzer** — analytics of historical games

### **6. Citizen** — "Citizenship Registry"

User management service. May later include authentication and profile management.

- **Citizen** — registered player
- **Profile** — preferences and settings

### **7. Vault** — "File Vault"

Manages files: upload, storage, image resizing, and compression.

- **File** — card images, animations, avatars

### **8. Chronicle** — "Chronicle of Events"

Stores audit logs and tracks all key actions across the system.

- **EventLog** — structured logs of changes and activities
