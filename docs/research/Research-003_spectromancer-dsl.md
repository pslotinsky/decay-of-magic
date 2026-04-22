# Research-003: Spectromancer DSL

| Field   | Value      |
| ------- | ---------- |
| Created | 2026-04-22 |

## Purpose

Catalog every Spectromancer card as a concrete DSL representation under the algebraic shape discussed in [Design-007](../design/Design-007_codex-realm.md).

The catalog serves as:

- A **stress test** of the DSL's coverage against a full card set (not cherry-picked examples).
- A **reference** for how specific mechanics encode.
- **Test fixtures** for DOD-0020 / DOD-0021 when the contract and in-memory implementation land.

Exact numbers (damage, heal, growth deltas) are best-effort — see [Research-001](./Research-001_cross-game-data-model.md) caveats on source-fetch limitations. Structure is what matters; numeric values can be corrected when authoritative text is re-verified.

## Notation

Full-fidelity JSON used throughout; shape follows [Design-007](../design/Design-007_codex-realm.md). Equivalences worth calling out up front:

- **Target shortcut** — a bare string in `target` (e.g. `"AllEnemies"`) is sugar for `{ "selector": "AllEnemies" }`; the longhand is used when a `filter` or `of` parameter is needed.
- **Entity refs** — elements, minions, and traits are referenced by universe-scoped slug: lowercase, kebab-case for multi-word (`"fire"`, `"wall"`, `"goblin-raider"`). Slugs are the stored form; the content store enforces `(universe_id, slug)` uniqueness and may carry a separate UUID primary key for internal joins. Engine-vocabulary strings (`"OnPlay"`, `"AllEnemies"`, `"Damage"`, `"Self"`, `"Modifier"`) stay in PascalCase — those are discriminator tags, not entity references.
- **Cost shortcut** — `{ "fire": 2 }` is sugar for `[{ "kind": "Element", "element": "fire", "amount": 2 }]`; multi-resource costs (Vampiric's Blood + Life) use the longhand array form.
- **Stats** — numeric fields accept either a plain number or a full expression node (see below).

### Ability shape

Every ability has the same template:

```json
{ "trigger": <event-or-whilePresent>, "target": <scope>, "effects": [ ... ] }
```

- `trigger: "whilePresent"` is the **Passive** case — the effects (typically `Modifier` entries) stay in force while the card is in play.
- Any other `trigger` value makes this a **Triggered** ability — the effects fire as a procedure when the event resolves.
- No `kind: "Passive" | "Triggered"` discriminator; `trigger` alone tells you which.
- Optional `"id": <string>` labels an ability so another node can reference it (see `isTargetOf` under Expression grammar).
- Optional `"required": true` on an `OnPlay` ability means the ability must be able to resolve for the card to be played at all — used for cards with mandatory sacrifice constraints (Emissary of Dorlak). If the target cannot be picked (e.g. no allies on board to choose from), the card cannot be cast.

### Scope

```json
"Self"                                                          // bare selector
{ "selector": "NeighborSlots" }                                 // selector only
{ "selector": "AllEnemies", "filter": <expr> }                  // with filter
{ "selector": "AllAllies", "excludeSelf": true }                // drop the ability's owner from the result
{ "selector": "NeighborSlots", "of": <scope> }                  // relative selector
```

`excludeSelf` is shorthand for the recurring `not(id(Target)==id(Self))` idiom. When both `filter` and `excludeSelf` are present they AND together.

### Expression grammar

One grammar covers filters, damage/heal amounts, and modifier values. Nodes are one of:

- **Literal** — bare number, string, or boolean.
- **Reference** — `{ "key": <attr>, "scope": <scope> }`. `key` can be:
  - a creature stat — `power`;
  - a creature attribute — `AttackDamage`, `AttacksPerTurn`, `cost`, `currentLife`, `traits`, `minion`, `id`;
  - a slot / battlefield attribute — `occupied` (is the slot filled), `alive` (is the creature still in play after the current effect), `blocked` (is the attacker facing a blocker), `replacedMinion` (the minion that this summon replaced, for `ReplaceWith`);
  - an element slug — reads that element's power on the scope's hero (e.g. `fire`, `water`, `blood`, `golem`);
  - a runtime element token — `HighestOpponentElement` (the opponent's highest-power element);
  - a user-named capture — the `as` label from an earlier `RecordAttribute` effect, accessed with `scope: "Event"` (e.g. Blood Ritual's `sacLife`);
  - a built-in event payload field, when `scope` is `Event`:
    - `damageDealt` — amount of damage in the current damage event;
    - `killedBy` — what caused the current kill: `"Damage"` | `"Destroy"` | `"Replace"`;
    - `killedCount` — how many creatures a bulk-kill effect just removed (Drain Souls, HellFire).
- **Operator** — `{ "operator": <op>, "args": [ ... ] }`.
  - Arithmetic: `add`, `sub`, `mul`, `div`, `min`, `half`, `count`, `randomRange`, `if`.
  - Comparison: `<`, `<=`, `>`, `>=`, `==`, `!=`.
  - Boolean: `and`, `or`, `not`.
  - Set / domain: `contains` (membership in a multi-valued attribute like `traits`), `isTargetOf`, `isNeighborOf`, `isLowestCost`.
  - `isTargetOf` takes a single string argument that names a sibling node's `"id"`: either a peer effect inside the same ability (Inferno) or a peer ability inside the same card (Divine Justice, Disintegrate). The referenced node must carry a matching `"id"` field.

### Engine vocabulary assumed

The engine is assumed to publish the vocabulary below. Per Research-001, each card is a composition of invocations against this vocabulary.

- **Events** (trigger values):
  - Built-in triggers: `OnPlay`, `OnTurnStart`, `OnTurnEnd`, `OnDeath`, `OnKilled`, `OnDamaged`, `OnBeforeDamage`, `OnBeforeSpellDamage`, `OnAttack`, `OnUnblockedAttack`, `OnOpponentSummon`, `whilePresent` (passive marker).
  - Generic filtered event: `{ "kind": "OnEvent", "event": <token>, "filter"?: <expr> }`. Observed tokens in this catalog:
    - `CreatureDied` — any creature leaving play; payload: the dying creature is accessible via `Target`, `killedBy` via `Event` (Keeper of Death, Holy Avenger).
    - `TargetKilledBySelf` — a creature Self damaged has now died (Steal Essence).
    - `SelfKilledEnemy` — Self's attack/effect killed an enemy creature.
    - `SelfDealtDamage` — Self dealt damage to any target; `damageDealt` via `Event` (Goblin Saboteur).
    - `SelfDamagedHero` — Self's damage specifically hit a hero.
    - `SelfBlocked` — Self was blocked by an opposing creature during attack.
    - `AllyDealtDamage` — any ally dealt damage; `damageDealt` via `Event` (Monument to Rage).
    - `AllySummoned` — any ally entered play (Templar).
    - `OwnerDamaged` — owner hero took damage.
    - `OwnerSkippedTurn` — owner's turn was skipped (stun, time lock).
    - `OpponentDamaged` — opponent hero took damage (Vampire Mystic).
  - Activated: `{ "kind": "Activated", "cost": [ ... ] }` for tap-style activated abilities.
- **Selectors / scopes**: `Self`, `OwnerHero`, `EnemyHero`, `Target`, `OpposingSlot`, `NeighborSlots`, `SameSlot`, `AllEnemies`, `AllAllies`, `AllCreatures`, `RandomEnemy`, `RandomAlly`, `RandomEmptySlot`, `HighestLifeEnemy`, `HighestAttackAlly`, `OwnHand`, `OpponentHand`, `LowestCostEnemy`, `StrongestEnemyByAttack`, `ChosenEnemy`, `ChosenAlly`, `ChosenCreature`, `ChosenEmptySlot`, `DamageSource`, `Event`.
- **Effects**:
  - Emission — `Damage`, `Heal`, `FullHeal`, `SummonMinion`, `GainElement`, `ApplyStatus`, `Destroy`, `DiscardCard`, `MoveToRandomSlot`, `MoveSelfTo`, `SwapPosition`, `ReplaceWith`, `ReplaceCard`, `ForceAttack`, `CastAdditionalSpell`, `SkipOpponentTurn`, `RecordAttribute`.
  - Replacement (in-flight event alteration) — `ReflectDamage`, `PreventDamage`, `RedirectDamage`, `AttackNow`.
  - `GainElement.element` accepts one of two kinds of string: a kebab-case **element slug** (`"fire"`, `"water"`, `"blood"`, `"golem"`, …) that names a catalog element, or a PascalCase **runtime token** that the engine resolves at invocation time — `"AllElements"` (broadcast over every base element, as for Mind Master), `"RandomElement"` (engine picks one at random, as for Insanian Shaman), `"HighestOpponentElement"` (the opponent's current highest-power element, as for Mana Burn). The runtime-token form is mutually exclusive with the slug form; cards using it carry no catalog element reference.
  - Attribute — `Modifier`, shaped `{ "kind": "Modifier", "attribute": <name>, "operator": <op>, "value": <expr>, "duration"?: <"whilePresent"|"thisTurn"|"nextTurn"|"permanent"|"untilNextAttack"|"whileBlocked"> }`. `ApplyStatus` uses the same `duration` field.
- **Modifier attributes** (namespace for `Modifier.attribute`): stats — `power`; combat — `AttackDamage`, `AttacksPerTurn`, `AttackBoost`, `DamageTaken`, `DamageTakenFlat`, `DamageTakenFromSpells`, `DamageToOpposing`, `SpellDamage`; resource — `SpellCost`, `CardCost`, `CardsPerTurn`; state flags — `Immune`, `ImmuneUntilFirstAttack`, `PreventSpellCasting`, `SpellDamageRedirectTo`. (The creature stat field `toughness` remains a literal in `stats`, but no catalog card modifies or references it at runtime.)

Cards that read "+N Fire power growth" are now modeled as a `Triggered OnTurnStart → GainElement fire +N` tick rather than a `FirePowerGrowth` attribute modifier — the growth-attribute family was absorbed into the triggered form (see discussion in Caveats). Likewise `ReflectDamage` became `OnBeforeDamage → ReflectDamage`, and `ImmuneToSpells` became `OnBeforeSpellDamage → PreventDamage`.

`Charge` has two distinct forms depending on who gains it:

- **Self-charge** — the card attacks the turn it is played (Fire Drake, Priestess of Moments, Time Dragon). Encoded as `OnPlay → AttackNow` targeting `Self`. Immediate one-shot effect; no status is stored.
- **Granted charge** — the card grants the permission-to-attack-this-turn to other creatures (Merfolk Overlord grants it to neighbors). Encoded as `ApplyStatus { status: "Charge", duration: "thisTurn" }` on the recipient. The status is consumed when that recipient next attacks or when the turn ends.

The two forms are not interchangeable: `AttackNow` triggers an attack *now*, while `ApplyStatus "Charge"` merely lifts the "played-this-turn" restriction on a different creature whose combat step hasn't happened yet.

Conventions in card headers: `Name · <cost>·<power>/<toughness>` for creatures, `Name · spell <cost>` for spells.

## Fire

### Goblin Berserker · 1·4/16

At turn start, damages neighboring creatures.

```json
{
  "cost": {
    "fire": 1
  },
  "stats": {
    "power": 4,
    "toughness": 16
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": {
        "selector": "NeighborSlots"
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Wall of Fire · 2·0/5

OnPlay: 5 damage to each opponent creature.

```json
{
  "cost": {
    "fire": 2
  },
  "stats": {
    "power": 0,
    "toughness": 5
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    }
  ]
}
```

### Priest of Fire · 3·3/13

Passive: +1 Fire power growth for owner.

```json
{
  "cost": {
    "fire": 3
  },
  "stats": {
    "power": 3,
    "toughness": 13
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Fire Drake · 4·4/18

Passive: Charge (attacks the turn it's played).

```json
{
  "cost": {
    "fire": 4
  },
  "stats": {
    "power": 4,
    "toughness": 18
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "Self",
      "effects": [
        {
          "kind": "AttackNow"
        }
      ]
    }
  ]
}
```

### Orc Chieftain · 5·3/17

Passive: neighboring non-wall creatures +2 attack.

```json
{
  "cost": {
    "fire": 5
  },
  "stats": {
    "power": 3,
    "toughness": 17
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "NeighborSlots",
        "filter": {
          "operator": "not",
          "args": [
            {
              "operator": "contains",
              "args": [
                {
                  "key": "traits",
                  "scope": "Target"
                },
                "wall"
              ]
            }
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttackDamage",
          "operator": "add",
          "value": 2
        }
      ]
    }
  ]
}
```

### Flame Wave · spell 6

OnPlay: heavy damage to all opponent creatures.

```json
{
  "cost": {
    "fire": 6
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Minotaur Commander · 7·6/20

Passive: other non-wall own creatures +1 attack.

```json
{
  "cost": {
    "fire": 7
  },
  "stats": {
    "power": 6,
    "toughness": 20
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "AllAllies",
        "excludeSelf": true,
        "filter": {
          "operator": "not",
          "args": [
            {
              "operator": "contains",
              "args": [
                {
                  "key": "traits",
                  "scope": "Target"
                },
                "wall"
              ]
            }
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttackDamage",
          "operator": "add",
          "value": 1
        }
      ]
    }
  ]
}
```

### Bargul · 8·8/26

OnPlay: damage to all other creatures (both sides).

```json
{
  "cost": {
    "fire": 8
  },
  "stats": {
    "power": 8,
    "toughness": 26
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllCreatures",
        "excludeSelf": true
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Inferno · spell 9

Heavy damage to chosen enemy, reduced damage to others.

```json
{
  "cost": {
    "fire": 9
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenEnemy",
      "effects": [
        {
          "id": "primary",
          "kind": "Damage",
          "amount": 10
        },
        {
          "kind": "Damage",
          "amount": 3,
          "target": {
            "selector": "AllEnemies",
            "filter": {
              "operator": "not",
              "args": [
                {
                  "operator": "isTargetOf",
                  "args": ["primary"]
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

### Fire Elemental · 10·?/37

Attack = owner's Fire power. OnPlay: damage EnemyHero and AllEnemies by Fire power. Passive: +1 Fire growth.

```json
{
  "cost": {
    "fire": 10
  },
  "stats": {
    "power": {
      "key": "fire",
      "scope": "OwnerHero"
    },
    "toughness": 37
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "fire",
            "scope": "OwnerHero"
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "fire",
            "scope": "OwnerHero"
          }
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Armageddon · spell 11

OnPlay: damage opponent and all creatures, scaled to Fire power.

```json
{
  "cost": {
    "fire": 11
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "fire",
            "scope": "OwnerHero"
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "fire",
            "scope": "OwnerHero"
          }
        }
      ]
    }
  ]
}
```

### Dragon · 12·9/40

Passive: +50% owner's spell damage.

```json
{
  "cost": {
    "fire": 12
  },
  "stats": {
    "power": 9,
    "toughness": 40
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "SpellDamage",
          "operator": "mul",
          "value": 1.5
        }
      ]
    }
  ]
}
```

## Water

### Meditation · spell 1

OnPlay: +1 Fire, Air, Earth power (base pool).

```json
{
  "cost": {
    "water": 1
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Sea Sprite · 2·5/22

At turn start, damages owner.

```json
{
  "cost": {
    "water": 2
  },
  "stats": {
    "power": 5,
    "toughness": 22
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Merfolk Apostate · 3·3/10

OnPlay: +N Fire power to owner.

```json
{
  "cost": {
    "water": 3
  },
  "stats": {
    "power": 3,
    "toughness": 10
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Ice Golem · 4·4/12

Passive: immune to spell/ability damage.

```json
{
  "cost": {
    "water": 4
  },
  "stats": {
    "power": 4,
    "toughness": 12
  },
  "abilities": [
    {
      "trigger": "OnBeforeSpellDamage",
      "target": "Self",
      "effects": [
        {
          "kind": "PreventDamage"
        }
      ]
    }
  ]
}
```

### Merfolk Elder · 5·3/16

Passive: +1 Air power growth.

```json
{
  "cost": {
    "water": 5
  },
  "stats": {
    "power": 3,
    "toughness": 16
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "air",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Ice Guard · 6·3/20

Passive: owner takes 50% damage.

```json
{
  "cost": {
    "water": 6
  },
  "stats": {
    "power": 3,
    "toughness": 20
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "DamageTaken",
          "operator": "mul",
          "value": 0.5
        }
      ]
    }
  ]
}
```

### Giant Turtle · 7·5/16

Passive: owner takes N less damage per source.

```json
{
  "cost": {
    "water": 7
  },
  "stats": {
    "power": 5,
    "toughness": 16
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "DamageTakenFlat",
          "operator": "sub",
          "value": 2
        }
      ]
    }
  ]
}
```

### Acidic Rain · spell 8

OnPlay: damage all creatures; −1 to each opponent power growth.

```json
{
  "cost": {
    "water": 8
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "ApplyStatus",
          "status": "PowerGrowthReduced",
          "amount": 1,
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

### Merfolk Overlord · 9·7/35

OnPlay: grants Charge to neighbors.

```json
{
  "cost": {
    "water": 9
  },
  "stats": {
    "power": 7,
    "toughness": 35
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "NeighborSlots"
      },
      "effects": [
        {
          "kind": "ApplyStatus",
          "status": "Charge",
          "duration": "thisTurn"
        }
      ]
    }
  ]
}
```

### Water Elemental · 10·?/37

Attack = Water power. OnPlay: full heal owner. Passive: +1 Water growth.

```json
{
  "cost": {
    "water": 10
  },
  "stats": {
    "power": {
      "key": "water",
      "scope": "OwnerHero"
    },
    "toughness": 37
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "FullHeal"
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "water",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Mind Master · 11·6/23

Passive: +1 to all owner power growths.

```json
{
  "cost": {
    "water": 11
  },
  "stats": {
    "power": 6,
    "toughness": 23
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "AllElements",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Astral Guard · 12·1/18

Passive: −1 to all opponent power growths.

```json
{
  "cost": {
    "water": 12
  },
  "stats": {
    "power": 1,
    "toughness": 18
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "AllElements",
          "amount": -1
        }
      ]
    }
  ]
}
```

## Air

### Faerie Apprentice · 1·4/12

Passive: +1 owner spell damage.

```json
{
  "cost": {
    "air": 1
  },
  "stats": {
    "power": 4,
    "toughness": 12
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "SpellDamage",
          "operator": "add",
          "value": 1
        }
      ]
    }
  ]
}
```

### Griffin · 2·3/15

OnPlay: if owner has ≥5 Air power, damage enemy hero.

```json
{
  "cost": {
    "air": 2
  },
  "stats": {
    "power": 3,
    "toughness": 15
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "filter": {
        "operator": ">=",
        "args": [
          {
            "key": "air",
            "scope": "OwnerHero"
          },
          5
        ]
      },
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Call to Thunder · spell 3

OnPlay: damage chosen creature and enemy hero.

```json
{
  "cost": {
    "air": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    }
  ]
}
```

### Faerie Sage · 4·4/19

OnPlay: heal owner = Earth power, capped at 10.

```json
{
  "cost": {
    "air": 4
  },
  "stats": {
    "power": 4,
    "toughness": 19
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "operator": "min",
            "args": [
              {
                "key": "earth",
                "scope": "OwnerHero"
              },
              10
            ]
          }
        }
      ]
    }
  ]
}
```

### Wall of Lightning · 5·0/28

At turn start: damage enemy hero.

```json
{
  "cost": {
    "air": 5
  },
  "stats": {
    "power": 0,
    "toughness": 28
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Lightning Bolt · spell 6

OnPlay: damage enemy hero = Air power.

```json
{
  "cost": {
    "air": 6
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "air",
            "scope": "OwnerHero"
          }
        }
      ]
    }
  ]
}
```

### Phoenix · 7·7/16

On killed: if Fire power ≥ threshold, revive in same slot (unless Destroyed).

```json
{
  "cost": {
    "air": 7
  },
  "stats": {
    "power": 7,
    "toughness": 16
  },
  "abilities": [
    {
      "trigger": "OnKilled",
      "filter": {
        "operator": "and",
        "args": [
          {
            "operator": ">=",
            "args": [
              {
                "key": "fire",
                "scope": "OwnerHero"
              },
              5
            ]
          },
          {
            "operator": "not",
            "args": [
              {
                "operator": "==",
                "args": [
                  {
                    "key": "killedBy",
                    "scope": "Event"
                  },
                  "Destroy"
                ]
              }
            ]
          }
        ]
      },
      "target": {
        "selector": "SameSlot"
      },
      "effects": [
        {
          "kind": "ReplaceWith",
          "minion": "phoenix"
        }
      ]
    }
  ]
}
```

### Chain Lightning · spell 8

OnPlay: damage enemy hero and all enemy creatures.

```json
{
  "cost": {
    "air": 8
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    }
  ]
}
```

### Lightning Cloud · 9·4/20

Modified attack behavior: attacking also damages enemy hero AND all enemies.

```json
{
  "cost": {
    "air": 9
  },
  "stats": {
    "power": 4,
    "toughness": 20
  },
  "abilities": [
    {
      "trigger": "OnAttack",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    },
    {
      "trigger": "OnAttack",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    }
  ]
}
```

### Tornado · spell 10

OnPlay: destroy chosen enemy creature.

```json
{
  "cost": {
    "air": 10
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenEnemy",
      "effects": [
        {
          "kind": "Destroy"
        }
      ]
    }
  ]
}
```

### Air Elemental · 11·?/44

Attack = Air power. OnPlay: damage enemy hero. Passive: +1 Air growth.

```json
{
  "cost": {
    "air": 11
  },
  "stats": {
    "power": {
      "key": "air",
      "scope": "OwnerHero"
    },
    "toughness": 44
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "air",
            "scope": "OwnerHero"
          }
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "air",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Titan · 12·9/40

OnPlay: heavy damage to opposing slot creature.

```json
{
  "cost": {
    "air": 12
  },
  "stats": {
    "power": 9,
    "toughness": 40
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OpposingSlot",
      "effects": [
        {
          "kind": "Damage",
          "amount": 20
        }
      ]
    }
  ]
}
```

## Earth

### Elven Healer · 1·2/12

At turn start: heal owner.

```json
{
  "cost": {
    "earth": 1
  },
  "stats": {
    "power": 2,
    "toughness": 12
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Nature's Ritual · spell 2

OnPlay: heal chosen creature and caster.

```json
{
  "cost": {
    "earth": 2
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenCreature",
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Forest Sprite · 3·1/22

OnAttack: damage both enemy hero and all enemies (like Lightning Cloud pattern).

```json
{
  "cost": {
    "earth": 3
  },
  "stats": {
    "power": 1,
    "toughness": 22
  },
  "abilities": [
    {
      "trigger": "OnAttack",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    },
    {
      "trigger": "OnAttack",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    }
  ]
}
```

### Rejuvenation · spell 4

OnPlay: heal caster = 2 × Earth power.

```json
{
  "cost": {
    "earth": 4
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "operator": "mul",
            "args": [
              {
                "key": "earth",
                "scope": "OwnerHero"
              },
              2
            ]
          }
        }
      ]
    }
  ]
}
```

### Elf Hermit · 5·1/13

Passive: +2 Earth power growth.

```json
{
  "cost": {
    "earth": 5
  },
  "stats": {
    "power": 1,
    "toughness": 13
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Nature's Fury · spell 6

OnPlay: damage enemy hero = highest-attack own creature's attack.

```json
{
  "cost": {
    "earth": 6
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "HighestAttackAlly"
          }
        }
      ]
    }
  ]
}
```

### Giant Spider · 7·4/24

OnPlay: summon Forest Spider in each empty neighbor.

```json
{
  "cost": {
    "earth": 7
  },
  "stats": {
    "power": 4,
    "toughness": 24
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "NeighborSlots",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "occupied",
              "scope": "Target"
            },
            false
          ]
        }
      },
      "effects": [
        {
          "kind": "SummonMinion",
          "minion": "forest-spider"
        }
      ]
    }
  ]
}
```

### Troll · 8·6/26

At turn start: self-heal.

```json
{
  "cost": {
    "earth": 8
  },
  "stats": {
    "power": 6,
    "toughness": 26
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "Self",
      "effects": [
        {
          "kind": "Heal",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Stone Rain · spell 9

OnPlay: equal damage to all creatures.

```json
{
  "cost": {
    "earth": 9
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Earth Elemental · 10·?/50

Attack = Earth power. Passive: +1 Earth growth.

```json
{
  "cost": {
    "earth": 10
  },
  "stats": {
    "power": {
      "key": "earth",
      "scope": "OwnerHero"
    },
    "toughness": 50
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Master Healer · 11·3/34

At turn start: heal owner and all own creatures.

```json
{
  "cost": {
    "earth": 11
  },
  "stats": {
    "power": 3,
    "toughness": 34
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": 4
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Hydra · 12·3/40

OnAttack: damage enemy hero and all creatures. At turn start: self-heal.

```json
{
  "cost": {
    "earth": 12
  },
  "stats": {
    "power": 3,
    "toughness": 40
  },
  "abilities": [
    {
      "trigger": "OnAttack",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    },
    {
      "trigger": "OnAttack",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "Self",
      "effects": [
        {
          "kind": "Heal",
          "amount": 3
        }
      ]
    }
  ]
}
```

## Death

### Dark Ritual · spell 1

OnPlay: damage all enemy creatures, heal all own creatures.

```json
{
  "cost": {
    "death": 1
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Cursed Fog · spell 2

OnPlay: damage all creatures and enemy hero.

```json
{
  "cost": {
    "death": 2
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Banshee · 3·4/21

OnPlay: damage opposing creature by half its life.

```json
{
  "cost": {
    "death": 3
  },
  "stats": {
    "power": 4,
    "toughness": 21
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OpposingSlot",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "half",
            "args": [
              {
                "key": "currentLife",
                "scope": "Target"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Emissary of Dorlak · 4·7/48

Must sacrifice an ally on play.

```json
{
  "cost": {
    "death": 4
  },
  "stats": {
    "power": 7,
    "toughness": 48
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenAlly",
      "required": true,
      "effects": [
        {
          "kind": "Destroy"
        }
      ]
    }
  ]
}
```

### Blood Ritual · spell 5

OnPlay: destroy own creature; damage enemy creatures = destroyed's life.

```json
{
  "cost": {
    "death": 5
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenAlly",
      "effects": [
        {
          "kind": "RecordAttribute",
          "attribute": "currentLife",
          "as": "sacLife"
        },
        {
          "kind": "Destroy"
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "sacLife",
            "scope": "Event"
          }
        }
      ]
    }
  ]
}
```

### Keeper of Death · 6·7/35

On enemy creature death: +1 Death power to owner.

```json
{
  "cost": {
    "death": 6
  },
  "stats": {
    "power": 7,
    "toughness": 35
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "CreatureDied",
        "filter": {
          "operator": "contains",
          "args": [
            {
              "key": "traits",
              "scope": "Target"
            },
            "enemy"
          ]
        }
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "death",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Drain Souls · spell 7

OnPlay: kill all creatures; heal = 2× killed count; replace self with Rage of Souls.

```json
{
  "cost": {
    "death": 7
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Destroy"
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "operator": "mul",
            "args": [
              {
                "key": "killedCount",
                "scope": "Event"
              },
              2
            ]
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnHand",
      "effects": [
        {
          "kind": "ReplaceCard",
          "with": "rage-of-souls"
        }
      ]
    }
  ]
}
```

### Master Lich · 8·8/46

OnPlay: damage all enemy creatures. On damaging opponent: +1 Death power.

```json
{
  "cost": {
    "death": 8
  },
  "stats": {
    "power": 8,
    "toughness": 46
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    },
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "SelfDamagedHero"
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "death",
          "amount": 1
        }
      ]
    }
  ]
}
```

## Holy

### Paladin · 1·4/9

OnPlay: heal all own creatures.

```json
{
  "cost": {
    "holy": 1
  },
  "stats": {
    "power": 4,
    "toughness": 9
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 3
        }
      ]
    }
  ]
}
```

### Monk · 2·4/13

On killed: +N Holy power to owner.

```json
{
  "cost": {
    "holy": 2
  },
  "stats": {
    "power": 4,
    "toughness": 13
  },
  "abilities": [
    {
      "trigger": "OnKilled",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "holy",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Holy Guard · 3·4/23

Passive: neighbors take reduced damage.

```json
{
  "cost": {
    "holy": 3
  },
  "stats": {
    "power": 4,
    "toughness": 23
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "NeighborSlots"
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "DamageTakenFlat",
          "operator": "sub",
          "value": 1
        }
      ]
    }
  ]
}
```

### Divine Justice · spell 4

OnPlay: heal one chosen creature heavily; damage all others equally.

```json
{
  "cost": {
    "holy": 4
  },
  "abilities": [
    {
      "id": "heal",
      "trigger": "OnPlay",
      "target": "ChosenCreature",
      "effects": [
        {
          "kind": "Heal",
          "amount": 12
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllCreatures",
        "filter": {
          "operator": "not",
          "args": [
            {
              "operator": "isTargetOf",
              "args": ["heal"]
            }
          ]
        }
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Divine Intervention · spell 5

OnPlay: +1 several power types, heal owner.

```json
{
  "cost": {
    "holy": 5
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "water",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": 1
        },
        {
          "kind": "Heal",
          "amount": 10
        }
      ]
    }
  ]
}
```

### Wrath of God · spell 6

OnPlay: damage all enemy creatures; Holy power += surviving enemy count.

```json
{
  "cost": {
    "holy": 6
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 8
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "holy",
          "amount": {
            "operator": "count",
            "args": [
              {
                "selector": "AllEnemies",
                "filter": {
                  "operator": "==",
                  "args": [
                    {
                      "key": "alive",
                      "scope": "Target"
                    },
                    true
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Angel · 7·8/42

OnPlay: +N Holy power to owner.

```json
{
  "cost": {
    "holy": 7
  },
  "stats": {
    "power": 8,
    "toughness": 42
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "holy",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Archangel · 8·8/48

OnPlay: fully heal all own creatures.

```json
{
  "cost": {
    "holy": 8
  },
  "stats": {
    "power": 8,
    "toughness": 48
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "FullHeal"
        }
      ]
    }
  ]
}
```

## Mechanical

### Overtime · spell 0

OnPlay: +1 Mechanics power.

```json
{
  "cost": {
    "mechanics": 0
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "mechanics",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Dwarven Rifleman · 2·4/17

When opponent summons: damage each enemy creature (reaction).

```json
{
  "cost": {
    "mechanics": 2
  },
  "stats": {
    "power": 4,
    "toughness": 17
  },
  "abilities": [
    {
      "trigger": "OnOpponentSummon",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Dwarven Craftsman · 3·2/17

Passive: +1 Mechanics growth.

```json
{
  "cost": {
    "mechanics": 3
  },
  "stats": {
    "power": 2,
    "toughness": 17
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "mechanics",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Ornithopter · 4·4/24

At turn start: damage all enemies.

```json
{
  "cost": {
    "mechanics": 4
  },
  "stats": {
    "power": 4,
    "toughness": 24
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Steel Golem · 5·6/20

Passive: immune to spells; damage reduced by flat amount.

```json
{
  "cost": {
    "mechanics": 5
  },
  "stats": {
    "power": 6,
    "toughness": 20
  },
  "abilities": [
    {
      "trigger": "OnBeforeSpellDamage",
      "target": "Self",
      "effects": [
        {
          "kind": "PreventDamage"
        }
      ]
    },
    {
      "trigger": "whilePresent",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "DamageTakenFlat",
          "operator": "sub",
          "value": 2
        }
      ]
    }
  ]
}
```

### Cannon · 6·8/29

At turn start: damage opponent's highest-life creature.

```json
{
  "cost": {
    "mechanics": 6
  },
  "stats": {
    "power": 8,
    "toughness": 29
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "HighestLifeEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 8
        }
      ]
    }
  ]
}
```

### Cannonade · spell 7

OnPlay: damage all enemy creatures.

```json
{
  "cost": {
    "mechanics": 7
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 7
        }
      ]
    }
  ]
}
```

### Steam Tank · 8·6/52

OnPlay: damage all enemies.

```json
{
  "cost": {
    "mechanics": 8
  },
  "stats": {
    "power": 6,
    "toughness": 52
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 12
        }
      ]
    }
  ]
}
```

## Illusion

### Madness · spell 1

OnPlay: damage each enemy creature = its own attack.

```json
{
  "cost": {
    "illusion": 1
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Target"
          }
        }
      ]
    }
  ]
}
```

### Phantom Warrior · 2·4/4

Passive: takes minimal damage from all sources.

```json
{
  "cost": {
    "illusion": 2
  },
  "stats": {
    "power": 4,
    "toughness": 4
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "DamageTaken",
          "operator": "set",
          "value": 1
        }
      ]
    }
  ]
}
```

### Hypnosis · spell 3

OnPlay: opponent's strongest creatures target opponent instead.

```json
{
  "cost": {
    "illusion": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "StrongestEnemyByAttack",
        "count": 2
      },
      "effects": [
        {
          "kind": "ApplyStatus",
          "status": "AttackOwnHero",
          "duration": "thisTurn"
        }
      ]
    }
  ]
}
```

### Wall of Reflection · 4·0/20

Passive: reflect damage back to opponent.

```json
{
  "cost": {
    "illusion": 4
  },
  "stats": {
    "power": 0,
    "toughness": 20
  },
  "abilities": [
    {
      "trigger": "OnBeforeDamage",
      "target": "Self",
      "effects": [
        {
          "kind": "ReflectDamage"
        }
      ]
    }
  ]
}
```

### Spectral Assassin · 5·6/22

OnPlay: damage enemy hero.

```json
{
  "cost": {
    "illusion": 5
  },
  "stats": {
    "power": 6,
    "toughness": 22
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Spectral Mage · 6·7/34

OnPlay: damage each enemy creature = that creature's cost.

```json
{
  "cost": {
    "illusion": 6
  },
  "stats": {
    "power": 7,
    "toughness": 34
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "cost",
            "scope": "Target"
          }
        }
      ]
    }
  ]
}
```

### Oracle · 7·8/41

At turn start: damage enemy hero = Illusion power.

```json
{
  "cost": {
    "illusion": 7
  },
  "stats": {
    "power": 8,
    "toughness": 41
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "illusion",
            "scope": "OwnerHero"
          }
        }
      ]
    }
  ]
}
```

### Hypnotist · 8·5/39

OnPlay: damage enemy hero + all enemies; +1 Illusion growth.

```json
{
  "cost": {
    "illusion": 8
  },
  "stats": {
    "power": 5,
    "toughness": 39
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "illusion",
          "amount": 1
        }
      ]
    }
  ]
}
```

## Control

### Goblin Shaman · 1·4/12

Passive: +1 cost on all opponent spells.

```json
{
  "cost": {
    "control": 1
  },
  "stats": {
    "power": 4,
    "toughness": 12
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "SpellCost",
          "operator": "add",
          "value": 1
        }
      ]
    }
  ]
}
```

### Weakness · spell 2

OnPlay: −1 each opponent power; damage enemy hero.

```json
{
  "cost": {
    "control": 2
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "water",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": -1
        },
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    }
  ]
}
```

### Damping Tower · 3·0/17

Passive: +1 cost to all opponent cards (not just spells).

```json
{
  "cost": {
    "control": 3
  },
  "stats": {
    "power": 0,
    "toughness": 17
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "OpponentHand"
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "CardCost",
          "operator": "add",
          "value": 1
        }
      ]
    }
  ]
}
```

### Ancient Horror · 4·5/25

Passive: enemies with cost < own Control power skip attack.

```json
{
  "cost": {
    "control": 4
  },
  "stats": {
    "power": 5,
    "toughness": 25
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "AllEnemies",
        "filter": {
          "operator": "<",
          "args": [
            {
              "key": "cost",
              "scope": "Target"
            },
            {
              "key": "control",
              "scope": "OwnerHero"
            }
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttacksPerTurn",
          "operator": "set",
          "value": 0
        }
      ]
    }
  ]
}
```

### Poisonous Cloud · spell 5

OnPlay: −1 all opponent powers; damage each creature by half life.

```json
{
  "cost": {
    "control": 5
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "water",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": -1
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "half",
            "args": [
              {
                "key": "currentLife",
                "scope": "Target"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Ancient Witch · 6·4/18

OnPlay: −1 all opponent powers.

```json
{
  "cost": {
    "control": 6
  },
  "stats": {
    "power": 4,
    "toughness": 18
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "water",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": -1
        }
      ]
    }
  ]
}
```

### Mindstealer · 7·8/36

On attacked: redirect damage to attacker.

```json
{
  "cost": {
    "control": 7
  },
  "stats": {
    "power": 8,
    "toughness": 36
  },
  "abilities": [
    {
      "trigger": "OnBeforeDamage",
      "target": "Self",
      "effects": [
        {
          "kind": "ReflectDamage"
        }
      ]
    }
  ]
}
```

### Ancient Giant · 8·8/49

OnPlay: opponent skips next turn.

```json
{
  "cost": {
    "control": 8
  },
  "stats": {
    "power": 8,
    "toughness": 49
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "SkipOpponentTurn"
        }
      ]
    }
  ]
}
```

## Chaos

### Insanian Peacekeeper · 1·4/11

At turn start: heal owner by a random amount in range.

```json
{
  "cost": {
    "chaos": 1
  },
  "stats": {
    "power": 4,
    "toughness": 11
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "operator": "randomRange",
            "args": [
              1,
              6
            ]
          }
        }
      ]
    }
  ]
}
```

### Insanian Berserker · 2·4/14

At turn start: damage opponent by random range.

```json
{
  "cost": {
    "chaos": 2
  },
  "stats": {
    "power": 4,
    "toughness": 14
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "randomRange",
            "args": [
              1,
              6
            ]
          }
        }
      ]
    }
  ]
}
```

### Doom Bolt · spell 3

OnPlay: heavy damage to random enemy creature.

```json
{
  "cost": {
    "chaos": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "RandomEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 20
        }
      ]
    }
  ]
}
```

### Chaotic Wave · spell 4

OnPlay: random-range damage to each enemy; random-range heal to each ally.

```json
{
  "cost": {
    "chaos": 4
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "randomRange",
            "args": [
              0,
              8
            ]
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "operator": "randomRange",
            "args": [
              0,
              8
            ]
          }
        }
      ]
    }
  ]
}
```

### Insanian Shaman · 5·3/25

At turn start: randomly reduce one opponent power.

```json
{
  "cost": {
    "chaos": 5
  },
  "stats": {
    "power": 3,
    "toughness": 25
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "RandomElement",
          "amount": -1
        }
      ]
    }
  ]
}
```

### Insanian Lord · 6·6/28

At turn start: randomly increase one own power.

```json
{
  "cost": {
    "chaos": 6
  },
  "stats": {
    "power": 6,
    "toughness": 28
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "RandomElement",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Insanian Catapult · 7·6/38

At turn start: damage random enemy creature.

```json
{
  "cost": {
    "chaos": 7
  },
  "stats": {
    "power": 6,
    "toughness": 38
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "RandomEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 10
        }
      ]
    }
  ]
}
```

### Insanian King · 8·6/46

At turn end: summon Soldier into random empty slot.

```json
{
  "cost": {
    "chaos": 8
  },
  "stats": {
    "power": 6,
    "toughness": 46
  },
  "abilities": [
    {
      "trigger": "OnTurnEnd",
      "target": "RandomEmptySlot",
      "effects": [
        {
          "kind": "SummonMinion",
          "minion": "soldier"
        }
      ]
    }
  ]
}
```

## Demonic

### Lemure · 1·4/8

On death: replace with Scrambled Lemure.

```json
{
  "cost": {
    "demonic": 1
  },
  "stats": {
    "power": 4,
    "toughness": 8
  },
  "abilities": [
    {
      "trigger": "OnDeath",
      "target": "SameSlot",
      "effects": [
        {
          "kind": "ReplaceWith",
          "minion": "scrambled-lemure"
        }
      ]
    }
  ]
}
```

### Explosion · spell 2

OnPlay: destroy own creature; heavy damage to opposing creature.

```json
{
  "cost": {
    "demonic": 2
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenAlly",
      "effects": [
        {
          "kind": "Destroy"
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "OpposingSlot",
        "of": "targetedAlly"
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 20
        }
      ]
    }
  ]
}
```

### Power Chains · spell 3

OnPlay: damage elemental creature; reduce opponent's matching power.

```json
{
  "cost": {
    "demonic": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "ChosenEnemy",
        "filter": {
          "operator": "contains",
          "args": [
            {
              "key": "traits",
              "scope": "Target"
            },
            "elemental"
          ]
        }
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 15
        },
        {
          "kind": "GainElement",
          "element": {
            "key": "element",
            "scope": "Target"
          },
          "amount": -2
        }
      ]
    }
  ]
}
```

### Ergodemon · 4·6/23

On killed: −1 to all opponent powers.

```json
{
  "cost": {
    "demonic": 4
  },
  "stats": {
    "power": 6,
    "toughness": 23
  },
  "abilities": [
    {
      "trigger": "OnKilled",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "water",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": -1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": -1
        }
      ]
    }
  ]
}
```

### Demon Quartermaster · 5·2/21

OnPlay: +N Demonic power. On death: replace with Enraged Quartermaster.

```json
{
  "cost": {
    "demonic": 5
  },
  "stats": {
    "power": 2,
    "toughness": 21
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "demonic",
          "amount": 2
        }
      ]
    },
    {
      "trigger": "OnDeath",
      "target": "SameSlot",
      "effects": [
        {
          "kind": "ReplaceWith",
          "minion": "enraged-quartermaster"
        }
      ]
    }
  ]
}
```

### HellFire · spell 6

OnPlay: damage all enemies; +1 Fire per creature killed.

```json
{
  "cost": {
    "demonic": 6
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 8
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": {
            "key": "killedCount",
            "scope": "Event"
          }
        }
      ]
    }
  ]
}
```

### Three-headed Demon · 7·3/30

OnAttack: damage enemy hero + all enemies. OnDeath: replace with smaller demon.

```json
{
  "cost": {
    "demonic": 7
  },
  "stats": {
    "power": 3,
    "toughness": 30
  },
  "abilities": [
    {
      "trigger": "OnAttack",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    },
    {
      "trigger": "OnAttack",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    },
    {
      "trigger": "OnDeath",
      "target": "SameSlot",
      "effects": [
        {
          "kind": "ReplaceWith",
          "minion": "two-headed-demon"
        }
      ]
    }
  ]
}
```

### Greater Demon · 8·8/42

OnPlay: damage enemy hero + all enemies by min(Fire power, 10).

```json
{
  "cost": {
    "demonic": 8
  },
  "stats": {
    "power": 8,
    "toughness": 42
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "min",
            "args": [
              {
                "key": "fire",
                "scope": "OwnerHero"
              },
              10
            ]
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "min",
            "args": [
              {
                "key": "fire",
                "scope": "OwnerHero"
              },
              10
            ]
          }
        }
      ]
    }
  ]
}
```

## Sorcery

### Healing Spray · spell 1

OnPlay: heal target creature and neighbors.

```json
{
  "cost": {
    "sorcery": 1
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenCreature",
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "NeighborSlots",
        "of": "targeted"
      },
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Fireball · spell 2

OnPlay: damage target opponent creature and its neighbors.

```json
{
  "cost": {
    "sorcery": 2
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "NeighborSlots",
        "of": "targeted"
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Steal Essence · spell 3

OnPlay: damage target; if killed, +1 Sorcery power.

```json
{
  "cost": {
    "sorcery": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    },
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "TargetKilledBySelf"
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "sorcery",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Sacrifice · spell 4

OnPlay: destroy own creature; gain multiple powers.

```json
{
  "cost": {
    "sorcery": 4
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenAlly",
      "effects": [
        {
          "kind": "Destroy"
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "sorcery",
          "amount": 2
        },
        {
          "kind": "GainElement",
          "element": "death",
          "amount": 2
        },
        {
          "kind": "GainElement",
          "element": "holy",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Ritual of Glory · spell 5

OnPlay: full heal all own creatures and +N attack this turn.

```json
{
  "cost": {
    "sorcery": 5
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "FullHeal"
        },
        {
          "kind": "ApplyStatus",
          "status": "AttackBoost",
          "amount": 3,
          "duration": "thisTurn"
        }
      ]
    }
  ]
}
```

### Mana Burn · spell 6

OnPlay: damage each enemy creature = opponent's highest power; reduce that power.

```json
{
  "cost": {
    "sorcery": 6
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "HighestOpponentElement",
            "scope": "EnemyHero"
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "HighestOpponentElement",
          "amount": -3
        }
      ]
    }
  ]
}
```

### Sonic Boom · spell 7

OnPlay: damage opponent and all enemies; prevent attacks next turn.

```json
{
  "cost": {
    "sorcery": 7
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        },
        {
          "kind": "ApplyStatus",
          "status": "SkipAttack",
          "duration": "nextTurn"
        }
      ]
    }
  ]
}
```

### Disintegrate · spell 8

OnPlay: destroy chosen enemy; damage all other enemies.

```json
{
  "cost": {
    "sorcery": 8
  },
  "abilities": [
    {
      "id": "destroy",
      "trigger": "OnPlay",
      "target": "ChosenEnemy",
      "effects": [
        {
          "kind": "Destroy"
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllEnemies",
        "filter": {
          "operator": "not",
          "args": [
            {
              "operator": "isTargetOf",
              "args": ["destroy"]
            }
          ]
        }
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    }
  ]
}
```

## Beast (activated abilities)

Beast cards have an **Activated** trigger in addition to any standard triggers. The activated ability has its own cost (tapping the creature, or a resource cost).

### Magic Hamster · 3·3/9

OnPlay: heal neighbors. Activated: heal all owner creatures.

```json
{
  "cost": {
    "beast": 3
  },
  "stats": {
    "power": 3,
    "toughness": 9
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "NeighborSlots"
      },
      "effects": [
        {
          "kind": "Heal",
          "amount": 4
        }
      ]
    },
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Scorpion · 2·5/18

OnPlay: stun opposing. Activated: damage target.

```json
{
  "cost": {
    "beast": 2
  },
  "stats": {
    "power": 5,
    "toughness": 18
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OpposingSlot",
      "effects": [
        {
          "kind": "ApplyStatus",
          "status": "Stun",
          "duration": "thisTurn"
        }
      ]
    },
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "ChosenEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Wolverine · 3·6/25

Activated: full heal + permanent +N attack.

```json
{
  "cost": {
    "beast": 3
  },
  "stats": {
    "power": 6,
    "toughness": 25
  },
  "abilities": [
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "Self",
      "effects": [
        {
          "kind": "FullHeal"
        },
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 2,
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

### Energy Beast · 4·6/34

Activated: +1 to all elemental powers.

```json
{
  "cost": {
    "beast": 4
  },
  "stats": {
    "power": 6,
    "toughness": 34
  },
  "abilities": [
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "water",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Death Falcon · 5·7/45

Activated: move to new slot + damage all enemies.

```json
{
  "cost": {
    "beast": 5
  },
  "stats": {
    "power": 7,
    "toughness": 45
  },
  "abilities": [
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "ChosenEmptySlot",
      "effects": [
        {
          "kind": "MoveSelfTo",
          "target": "ChosenEmptySlot"
        },
        {
          "kind": "Damage",
          "amount": 6,
          "target": "AllEnemies"
        }
      ]
    }
  ]
}
```

### White Elephant · 6·8/40

Passive: absorbs damage for owner. Activated: +N Beast power.

```json
{
  "cost": {
    "beast": 6
  },
  "stats": {
    "power": 8,
    "toughness": 40
  },
  "abilities": [
    {
      "trigger": "OnBeforeDamage",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "RedirectDamage",
          "to": "self"
        }
      ]
    },
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "beast",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Basilisk · 7·6/54

At turn end: damage weak enemies. Activated: damage target.

```json
{
  "cost": {
    "beast": 7
  },
  "stats": {
    "power": 6,
    "toughness": 54
  },
  "abilities": [
    {
      "trigger": "OnTurnEnd",
      "target": {
        "selector": "AllEnemies",
        "filter": {
          "operator": "<",
          "args": [
            {
              "key": "currentLife",
              "scope": "Target"
            },
            10
          ]
        }
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 10
        }
      ]
    },
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "ChosenEnemy",
      "effects": [
        {
          "kind": "Damage",
          "amount": 10
        }
      ]
    }
  ]
}
```

### Ancient Dragon · 8·8/45

OnPlay: +1 all owner powers. Activated: damage enemy hero + all enemies.

```json
{
  "cost": {
    "beast": 8
  },
  "stats": {
    "power": 8,
    "toughness": 45
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "AllElements",
          "amount": 1
        }
      ]
    },
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 10
        }
      ]
    },
    {
      "trigger": {
        "kind": "Activated",
        "cost": [
          {
            "kind": "Tap"
          }
        ]
      },
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 10
        }
      ]
    }
  ]
}
```

## Goblin

### Rescue Operation · spell 0

OnPlay: move a creature randomly; heal owner's creatures.

```json
{
  "cost": {
    "goblin": 0
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenAlly",
      "effects": [
        {
          "kind": "MoveToRandomSlot"
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Goblin Hero · 1·3/14

Passive: +1 attack per neighboring creature. OnOpponentSummon: move randomly.

```json
{
  "cost": {
    "goblin": 1
  },
  "stats": {
    "power": 3,
    "toughness": 14
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttackDamage",
          "operator": "add",
          "value": {
            "operator": "count",
            "args": [
              {
                "selector": "NeighborSlots",
                "filter": {
                  "operator": "==",
                  "args": [
                    {
                      "key": "occupied",
                      "scope": "Target"
                    },
                    true
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    {
      "trigger": "OnOpponentSummon",
      "target": "Self",
      "effects": [
        {
          "kind": "MoveToRandomSlot"
        }
      ]
    }
  ]
}
```

### Goblin Saboteur · 2·5/20

On damage dealt: opponent discards cheapest card.

```json
{
  "cost": {
    "goblin": 2
  },
  "stats": {
    "power": 5,
    "toughness": 20
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "SelfDealtDamage"
      },
      "target": {
        "selector": "OpponentHand",
        "filter": {
          "operator": "isLowestCost",
          "args": [
            {
              "key": "id",
              "scope": "Target"
            }
          ]
        }
      },
      "effects": [
        {
          "kind": "DiscardCard"
        }
      ]
    }
  ]
}
```

### Army of Rats · spell 3

OnPlay: damage all enemy creatures; damage random own creature.

```json
{
  "cost": {
    "goblin": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "RandomAlly",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    }
  ]
}
```

### Portal Jumper · 4·5/28

At turn end: stun opposing, then move randomly.

```json
{
  "cost": {
    "goblin": 4
  },
  "stats": {
    "power": 5,
    "toughness": 28
  },
  "abilities": [
    {
      "trigger": "OnTurnEnd",
      "target": "OpposingSlot",
      "effects": [
        {
          "kind": "ApplyStatus",
          "status": "Stun",
          "duration": "thisTurn"
        }
      ]
    },
    {
      "trigger": "OnTurnEnd",
      "target": "Self",
      "effects": [
        {
          "kind": "MoveToRandomSlot"
        }
      ]
    }
  ]
}
```

### Goblin Looter · 5·5/28

On any creature death: +1 random own power.

```json
{
  "cost": {
    "goblin": 5
  },
  "stats": {
    "power": 5,
    "toughness": 28
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "CreatureDied"
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "RandomElement",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Goblin Raider · 6·4/24

OnPlay: summon two more Raiders in random empty slots.

```json
{
  "cost": {
    "goblin": 6
  },
  "stats": {
    "power": 4,
    "toughness": 24
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "RandomEmptySlot",
      "effects": [
        {
          "kind": "SummonMinion",
          "minion": "goblin-raider",
          "count": 2
        }
      ]
    }
  ]
}
```

### Ratmaster · 7·7/47

At turn start: damage all enemies; reduce random own power.

```json
{
  "cost": {
    "goblin": 7
  },
  "stats": {
    "power": 7,
    "toughness": 47
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "RandomElement",
          "amount": -1
        }
      ]
    }
  ]
}
```

## Forest

### Crazy Squirrel · 1·2/2

OnPlay: damage opposing creature.

```json
{
  "cost": {
    "forest": 1
  },
  "stats": {
    "power": 2,
    "toughness": 2
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OpposingSlot",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Forest Wolf · 2·0/24

OnPlay on Magic Rabbit: inherit attack. (stats field expresses the conditional.)

```json
{
  "cost": {
    "forest": 2
  },
  "stats": {
    "power": {
      "operator": "if",
      "args": [
        {
          "operator": "==",
          "args": [
            {
              "key": "replacedMinion",
              "scope": "Self"
            },
            "magic-rabbit"
          ]
        },
        {
          "key": "power",
          "scope": "ReplacedMinion"
        },
        0
      ]
    },
    "toughness": 24
  }
}
```

### Vindictive Raccoon · 3·4/14

OnPlay: damage opponent = opposing creature's attack.

```json
{
  "cost": {
    "forest": 3
  },
  "stats": {
    "power": 4,
    "toughness": 14
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": "OpposingSlot"
          }
        }
      ]
    }
  ]
}
```

### Enraged Beaver · 4·3/10

OnPlay: damage opponent + all enemies = Magic Rabbit's attack.

```json
{
  "cost": {
    "forest": 4
  },
  "stats": {
    "power": 3,
    "toughness": 10
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": {
              "selector": "AllAllies",
              "filter": {
                "operator": "==",
                "args": [
                  {
                    "key": "minion",
                    "scope": "Target"
                  },
                  "magic-rabbit"
                ]
              }
            }
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "power",
            "scope": {
              "selector": "AllAllies",
              "filter": {
                "operator": "==",
                "args": [
                  {
                    "key": "minion",
                    "scope": "Target"
                  },
                  "magic-rabbit"
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

### Ritual of the Forest · spell 5

OnPlay: heal caster and own creatures = Magic Rabbit's attack.

```json
{
  "cost": {
    "forest": 5
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "key": "power",
            "scope": {
              "selector": "AllAllies",
              "filter": {
                "operator": "==",
                "args": [
                  {
                    "key": "minion",
                    "scope": "Target"
                  },
                  "magic-rabbit"
                ]
              }
            }
          }
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "key": "power",
            "scope": {
              "selector": "AllAllies",
              "filter": {
                "operator": "==",
                "args": [
                  {
                    "key": "minion",
                    "scope": "Target"
                  },
                  "magic-rabbit"
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

### Treefolk Protector · 6·4/25

Passive: −N opponent spell damage.

```json
{
  "cost": {
    "forest": 6
  },
  "stats": {
    "power": 4,
    "toughness": 25
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "SpellDamage",
          "operator": "sub",
          "value": 2
        }
      ]
    }
  ]
}
```

### Bee Queen · 7·3/14

OnPlay: summon Bee Soldiers in empty slots. On any bee death: damage opponent.

```json
{
  "cost": {
    "forest": 7
  },
  "stats": {
    "power": 3,
    "toughness": 14
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllAllyEmptySlots"
      },
      "effects": [
        {
          "kind": "SummonMinion",
          "minion": "bee-soldier"
        }
      ]
    },
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "CreatureDied",
        "filter": {
          "operator": "contains",
          "args": [
            {
              "key": "traits",
              "scope": "Target"
            },
            "bee"
          ]
        }
      },
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Angry Angry Bear · 8·5/30

On damaged: permanent +N attack.

```json
{
  "cost": {
    "forest": 8
  },
  "stats": {
    "power": 5,
    "toughness": 30
  },
  "abilities": [
    {
      "trigger": "OnDamaged",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 1,
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

## Time

### Chrono Hunter · 1·4/11

On killing enemy creature: +N Time power.

```json
{
  "cost": {
    "time": 1
  },
  "stats": {
    "power": 4,
    "toughness": 11
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "SelfKilledEnemy"
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "time",
          "amount": 1
        }
      ]
    }
  ]
}
```

### Timeblazer · 2·5/17

OnPlay: neighbors target opponent instead of opposing.

```json
{
  "cost": {
    "time": 2
  },
  "stats": {
    "power": 5,
    "toughness": 17
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "NeighborSlots"
      },
      "effects": [
        {
          "kind": "ApplyStatus",
          "status": "AttackOpponent",
          "duration": "thisTurn"
        }
      ]
    }
  ]
}
```

### Hasten · spell 3

OnPlay: force own creature to attack enemy hero and all creatures.

```json
{
  "cost": {
    "time": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "ChosenAlly",
      "effects": [
        {
          "kind": "ForceAttack",
          "target": "EnemyHero"
        },
        {
          "kind": "ForceAttack",
          "target": "AllEnemies"
        }
      ]
    }
  ]
}
```

### Time Stop · spell 4

OnPlay: damage all enemies; opponent skips next turn.

```json
{
  "cost": {
    "time": 4
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "SkipOpponentTurn"
        }
      ]
    }
  ]
}
```

### Timeweaver · 5·5/24

OnPlay: allow extra spell this turn. Passive: −1 owner spell costs.

```json
{
  "cost": {
    "time": 5
  },
  "stats": {
    "power": 5,
    "toughness": 24
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "CastAdditionalSpell"
        }
      ]
    },
    {
      "trigger": "whilePresent",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "SpellCost",
          "operator": "add",
          "value": -1
        }
      ]
    }
  ]
}
```

### Priestess of Moments · 6·4/35

Passive: own creatures +1 attacks per turn; Charge.

```json
{
  "cost": {
    "time": 6
  },
  "stats": {
    "power": 4,
    "toughness": 35
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttacksPerTurn",
          "operator": "add",
          "value": 1
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "AttackNow"
        }
      ]
    }
  ]
}
```

### Chrono Engine · 7·3/33

Passive: +1 card per turn. On skip turn: +N Time power.

```json
{
  "cost": {
    "time": 7
  },
  "stats": {
    "power": 3,
    "toughness": 33
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "CardsPerTurn",
          "operator": "add",
          "value": 1
        }
      ]
    },
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "OwnerSkippedTurn"
      },
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "time",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Time Dragon · 8·8/40

OnPlay: +1 card use this turn; Charge.

```json
{
  "cost": {
    "time": 8
  },
  "stats": {
    "power": 8,
    "toughness": 40
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "CastAdditionalSpell"
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "Self",
      "effects": [
        {
          "kind": "AttackNow"
        }
      ]
    }
  ]
}
```

## Spirit (Holy variant)

### Crusader · 1·4/15

OnPlay: heal own creatures.

```json
{
  "cost": {
    "spirit": 1
  },
  "stats": {
    "power": 4,
    "toughness": 15
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 4
        }
      ]
    }
  ]
}
```

### Holy Avenger · 2·4/23

On neighbor death: permanent +N attack.

```json
{
  "cost": {
    "spirit": 2
  },
  "stats": {
    "power": 4,
    "toughness": 23
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "CreatureDied",
        "filter": {
          "operator": "isNeighborOf",
          "args": [
            {
              "key": "id",
              "scope": "Self"
            }
          ]
        }
      },
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 1,
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

### Templar · 3·4/26

On neighbor summoned: damage enemy hero.

```json
{
  "cost": {
    "spirit": 3
  },
  "stats": {
    "power": 4,
    "toughness": 26
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "AllySummoned",
        "filter": {
          "operator": "isNeighborOf",
          "args": [
            {
              "key": "id",
              "scope": "Self"
            }
          ]
        }
      },
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Divine Meddling · spell 5

OnPlay: +1 elemental powers; damage enemy hero.

```json
{
  "cost": {
    "spirit": 5
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "water",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "air",
          "amount": 1
        },
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": 1
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    }
  ]
}
```

### Rage of God · spell 6

OnPlay: damage all enemies; bonus damage per survivor.

```json
{
  "cost": {
    "spirit": 6
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "count",
            "args": [
              {
                "selector": "AllEnemies",
                "filter": {
                  "operator": "==",
                  "args": [
                    {
                      "key": "alive",
                      "scope": "Target"
                    },
                    true
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Angel of War · 8·8/37

OnPlay: damage all enemies; heal all allies.

```json
{
  "cost": {
    "spirit": 8
  },
  "stats": {
    "power": 8,
    "toughness": 37
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    }
  ]
}
```

## Vampiric

Vampiric costs pay in **Blood** element and **Life** simultaneously — multi-resource CostComponent array.

### Blood Boil · spell 1

OnPlay: damage all enemies; +1 Blood per kill.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 1
    },
    {
      "kind": "Life",
      "amount": 1
    }
  ],
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "blood",
          "amount": {
            "key": "killedCount",
            "scope": "Event"
          }
        }
      ]
    }
  ]
}
```

### Ghoul · 2·4/25

On enemy death: permanent +1 attack.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 2
    },
    {
      "kind": "Life",
      "amount": 2
    }
  ],
  "stats": {
    "power": 4,
    "toughness": 25
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "CreatureDied",
        "filter": {
          "operator": "contains",
          "args": [
            {
              "key": "traits",
              "scope": "Target"
            },
            "enemy"
          ]
        }
      },
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 1,
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

### Devoted Servant · 3·1/19

At turn start: permanent +1 attack. On killed: +attack in Blood.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 3
    },
    {
      "kind": "Life",
      "amount": 2
    }
  ],
  "stats": {
    "power": 1,
    "toughness": 19
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 1,
          "duration": "permanent"
        }
      ]
    },
    {
      "trigger": "OnKilled",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "blood",
          "amount": {
            "key": "power",
            "scope": "Self"
          }
        }
      ]
    }
  ]
}
```

### Vampire Mystic · 4·5/46

Attack increases this turn per opponent damage taken.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 4
    },
    {
      "kind": "Life",
      "amount": 3
    }
  ],
  "stats": {
    "power": 5,
    "toughness": 46
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "OpponentDamaged"
      },
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 1,
          "duration": "thisTurn"
        }
      ]
    }
  ]
}
```

### Justicar · 5·3/49

Passive: double damage to opposing; on unblocked attack: +extra damage.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 5
    },
    {
      "kind": "Life",
      "amount": 3
    }
  ],
  "stats": {
    "power": 3,
    "toughness": 49
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "DamageToOpposing",
          "operator": "mul",
          "value": 2
        }
      ]
    },
    {
      "trigger": "OnUnblockedAttack",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    }
  ]
}
```

### Chastiser · 6·9/51

On owner damaged: +attack through next attack.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 6
    },
    {
      "kind": "Life",
      "amount": 4
    }
  ],
  "stats": {
    "power": 9,
    "toughness": 51
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "OwnerDamaged"
      },
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 3,
          "duration": "untilNextAttack"
        }
      ]
    }
  ]
}
```

### Vampire Elder · 7·5/27

OnPlay: summon Initiates. While in play: Initiates take no damage.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 7
    },
    {
      "kind": "Life",
      "amount": 4
    }
  ],
  "stats": {
    "power": 5,
    "toughness": 27
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllAllyEmptySlots"
      },
      "effects": [
        {
          "kind": "SummonMinion",
          "minion": "initiate"
        }
      ]
    },
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "AllAllies",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "minion",
              "scope": "Target"
            },
            "initiate"
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "Immune",
          "operator": "set",
          "value": true
        }
      ]
    }
  ]
}
```

### Magister of Blood · 8·8/33

OnPlay: damage enemy hero + all blocked enemies.

```json
{
  "cost": [
    {
      "kind": "Element",
      "element": "blood",
      "amount": 8
    },
    {
      "kind": "Life",
      "amount": 5
    }
  ],
  "stats": {
    "power": 8,
    "toughness": 33
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 8
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllEnemies",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "blocked",
              "scope": "Target"
            },
            true
          ]
        }
      },
      "effects": [
        {
          "kind": "Damage",
          "amount": 8
        }
      ]
    }
  ]
}
```

## Cult (Worship)

### Fanatic · 1·4/26

Passive: takes 2× damage from opponent spells.

```json
{
  "cost": {
    "cult": 1
  },
  "stats": {
    "power": 4,
    "toughness": 26
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "DamageTakenFromSpells",
          "operator": "mul",
          "value": 2
        }
      ]
    }
  ]
}
```

### Call to Ancient Spirits · spell 2

OnPlay: damage enemy creatures; also damage own creatures.

```json
{
  "cost": {
    "cult": 2
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 5
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    }
  ]
}
```

### Zealot · 3·3/42

At turn start: +1 attack; loses life = damage dealt.

```json
{
  "cost": {
    "cult": 3
  },
  "stats": {
    "power": 3,
    "toughness": 42
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 1,
          "duration": "permanent"
        }
      ]
    },
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "SelfDealtDamage"
      },
      "target": "Self",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "damageDealt",
            "scope": "Event"
          }
        }
      ]
    }
  ]
}
```

### Monument to Rage · 4·0/63

Passive: own creatures +1 attacks/turn. On own-creature attack: self takes damage = dealt.

```json
{
  "cost": {
    "cult": 4
  },
  "stats": {
    "power": 0,
    "toughness": 63
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttacksPerTurn",
          "operator": "add",
          "value": 1
        }
      ]
    },
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "AllyDealtDamage"
      },
      "target": "Self",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "key": "damageDealt",
            "scope": "Event"
          }
        }
      ]
    }
  ]
}
```

### Cursed Unicorn · 5·6/53

Passive: recurring damage when blocked; redirects spell damage to blocker.

```json
{
  "cost": {
    "cult": 5
  },
  "stats": {
    "power": 6,
    "toughness": 53
  },
  "abilities": [
    {
      "trigger": {
        "kind": "OnEvent",
        "event": "SelfBlocked"
      },
      "target": "Self",
      "effects": [
        {
          "kind": "ApplyStatus",
          "status": "RecurringDamage",
          "amount": 2,
          "duration": "whileBlocked"
        }
      ]
    },
    {
      "trigger": "whilePresent",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "SpellDamageRedirectTo",
          "operator": "set",
          "value": "OpposingSlot"
        }
      ]
    }
  ]
}
```

### Blind Prophet · 6·5/27

Passive: +1 elemental power growth; −1 Worship (Cult) growth.

```json
{
  "cost": {
    "cult": 6
  },
  "stats": {
    "power": 5,
    "toughness": 27
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "fire",
          "amount": 1
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "water",
          "amount": 1
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "air",
          "amount": 1
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "earth",
          "amount": 1
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "GainElement",
          "element": "cult",
          "amount": -1
        }
      ]
    }
  ]
}
```

### Reaver · 7·8/56

Passive: absorbs damage for other own creatures; prevents owner spellcasting.

```json
{
  "cost": {
    "cult": 7
  },
  "stats": {
    "power": 8,
    "toughness": 56
  },
  "abilities": [
    {
      "trigger": "OnBeforeDamage",
      "target": {
        "selector": "AllAllies",
        "excludeSelf": true
      },
      "effects": [
        {
          "kind": "RedirectDamage",
          "to": "self"
        }
      ]
    },
    {
      "trigger": "whilePresent",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "PreventSpellCasting",
          "operator": "set",
          "value": true
        }
      ]
    }
  ]
}
```

### Greater Bargul · 8·13/58

OnPlay: damage all creatures. At turn start: damage owner.

```json
{
  "cost": {
    "cult": 8
  },
  "stats": {
    "power": 13,
    "toughness": 58
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllCreatures",
      "effects": [
        {
          "kind": "Damage",
          "amount": 8
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

## Golem

### Golem's Frenzy · spell 1

OnPlay: damage all enemies; Golem +attack per kill.

```json
{
  "cost": {
    "golem": 1
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 3
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllAllies",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "minion",
              "scope": "Target"
            },
            "golem"
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": {
            "key": "killedCount",
            "scope": "Event"
          },
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

### Guardian Statue · 2·4/10

Passive: immune until first attack.

```json
{
  "cost": {
    "golem": 2
  },
  "stats": {
    "power": 4,
    "toughness": 10
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "ImmuneUntilFirstAttack",
          "operator": "set",
          "value": true
        }
      ]
    }
  ]
}
```

### Golem's Justice · spell 3

OnPlay: damage enemies; heal Golem's neighbors.

```json
{
  "cost": {
    "golem": 3
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "NeighborSlots",
        "of": {
          "selector": "AllAllies",
          "filter": {
            "operator": "==",
            "args": [
              {
                "key": "minion",
                "scope": "Target"
              },
              "golem"
            ]
          }
        }
      },
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    }
  ]
}
```

### Army Upgrade · spell 4

OnPlay: heal allies; permanent +Golem attack.

```json
{
  "cost": {
    "golem": 4
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 6
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllAllies",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "minion",
              "scope": "Target"
            },
            "golem"
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 2,
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

### Golem Instructor · 5·?/22

Attack = own creature count. Passive: +2 Golem attack.

```json
{
  "cost": {
    "golem": 5
  },
  "stats": {
    "power": {
      "operator": "count",
      "args": [
        {
          "selector": "AllAllies"
        }
      ]
    },
    "toughness": 22
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "AllAllies",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "minion",
              "scope": "Target"
            },
            "golem"
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttackDamage",
          "operator": "add",
          "value": 2
        }
      ]
    }
  ]
}
```

### Dark Sculptor · 6·2/8

OnPlay: damage all enemies = in-play creature count.

```json
{
  "cost": {
    "golem": 6
  },
  "stats": {
    "power": 2,
    "toughness": 8
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": {
            "operator": "count",
            "args": [
              {
                "selector": "AllCreatures"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Golem Guide · 7·7/32

OnPlay: swap position with Golem; +Golem attack temporarily.

```json
{
  "cost": {
    "golem": 7
  },
  "stats": {
    "power": 7,
    "toughness": 32
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": {
        "selector": "AllAllies",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "minion",
              "scope": "Target"
            },
            "golem"
          ]
        }
      },
      "effects": [
        {
          "kind": "SwapPosition",
          "with": "Target"
        },
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 3,
          "duration": "thisTurn"
        }
      ]
    }
  ]
}
```

### Golem Handler · 8·5/40

Passive: Golem gains extra attacks while in play.

```json
{
  "cost": {
    "golem": 8
  },
  "stats": {
    "power": 5,
    "toughness": 40
  },
  "abilities": [
    {
      "trigger": "whilePresent",
      "target": {
        "selector": "AllAllies",
        "filter": {
          "operator": "==",
          "args": [
            {
              "key": "minion",
              "scope": "Target"
            },
            "golem"
          ]
        }
      },
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "AttacksPerTurn",
          "operator": "add",
          "value": 1
        }
      ]
    }
  ]
}
```

## Other / tokens and spawn forms

### Rage of Souls · spell 7

Spawned from Drain Souls. OnPlay: damage all enemies; heal per kill.

```json
{
  "cost": {
    "death": 7
  },
  "abilities": [
    {
      "trigger": "OnPlay",
      "target": "AllEnemies",
      "effects": [
        {
          "kind": "Damage",
          "amount": 6
        }
      ]
    },
    {
      "trigger": "OnPlay",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": {
            "key": "killedCount",
            "scope": "Event"
          }
        }
      ]
    }
  ]
}
```

### Scrambled Lemure · 1·3/6

Weaker form from Lemure's death. Vanilla.

```json
{
  "cost": {
    "demonic": 1
  },
  "stats": {
    "power": 3,
    "toughness": 6
  }
}
```

### Enraged Quartermaster · 5·6/20

Stronger form spawned from Demon Quartermaster.

```json
{
  "cost": {
    "demonic": 5
  },
  "stats": {
    "power": 6,
    "toughness": 20
  }
}
```

### Demon Apostate · 7·2/25

Spawned form. At turn start: heal owner and allies.

```json
{
  "cost": {
    "demonic": 7
  },
  "stats": {
    "power": 2,
    "toughness": 25
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Heal",
          "amount": 3
        }
      ]
    },
    {
      "trigger": "OnTurnStart",
      "target": "AllAllies",
      "effects": [
        {
          "kind": "Heal",
          "amount": 3
        }
      ]
    }
  ]
}
```

### Magic Rabbit · 3·1/10

Summoned passively by the Forest school. At turn start: permanent +1 attack.

```json
{
  "cost": {
    "forest": 3
  },
  "stats": {
    "power": 1,
    "toughness": 10
  },
  "abilities": [
    {
      "trigger": "OnTurnStart",
      "target": "Self",
      "effects": [
        {
          "kind": "Modifier",
          "attribute": "power",
          "operator": "add",
          "value": 1,
          "duration": "permanent"
        }
      ]
    }
  ]
}
```

### Bee Soldier · 0·2/8

Token spawned by Bee Queen. On killed: damage enemy hero.

```json
{
  "cost": {
    "forest": 0
  },
  "stats": {
    "power": 2,
    "toughness": 8
  },
  "abilities": [
    {
      "trigger": "OnKilled",
      "target": "EnemyHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 2
        }
      ]
    }
  ]
}
```

### Initiate · 0·5/14

Token summoned by Vampire Elder. Protected by Elder's passive.

```json
{
  "cost": {
    "blood": 0
  },
  "stats": {
    "power": 5,
    "toughness": 14
  }
}
```

### Golem · 3·3/10

Passive: immune to spell damage. On killed: revive in random slot (owner loses life).

```json
{
  "cost": {
    "golem": 3
  },
  "stats": {
    "power": 3,
    "toughness": 10
  },
  "abilities": [
    {
      "trigger": "OnBeforeSpellDamage",
      "target": "Self",
      "effects": [
        {
          "kind": "PreventDamage"
        }
      ]
    },
    {
      "trigger": "OnKilled",
      "target": "OwnerHero",
      "effects": [
        {
          "kind": "Damage",
          "amount": 4
        },
        {
          "kind": "SummonMinion",
          "minion": "golem",
          "target": "RandomEmptySlot"
        }
      ]
    }
  ]
}
```

### Soldier · 0·4/15

Token summoned by Insanian King. Vanilla.

```json
{
  "cost": {
    "chaos": 0
  },
  "stats": {
    "power": 4,
    "toughness": 15
  }
}
```

### Forest Spider · 0·2/11

Token summoned by Giant Spider. Vanilla.

```json
{
  "cost": {
    "earth": 0
  },
  "stats": {
    "power": 2,
    "toughness": 11
  }
}
```

## Coverage summary

All ~140 cards in the Spectromancer set expressed under the unified DSL shape. Every card resolves to:

- A `cost` — shortcut object `{ <element>: N }` for single-resource costs, longhand array `[{kind:"Element",...}, {kind:"Life",...}]` for multi-resource (Vampiric).
- `stats` — literal numbers or an expression node (elementals, Golem Instructor, Dark Sculptor, Forest Wolf).
- `abilities` — every entry shaped `{ trigger, target, effects }`, with `trigger: "whilePresent"` marking passives.

### What the unified grammar absorbed

Rewriting the catalog under the unified shape collapsed several constructs that were previously distinct:

- **`kind: "Passive" | "Triggered"` discriminator** — gone. `trigger` alone disambiguates (`"whilePresent"` for passives, any event for triggered).
- **`Passive.modifier` shape** — replaced with a first-class `Modifier` effect inside `effects: [...]`. Same payload, now peer to `Damage`, `Heal`, etc.
- **`ModifyStats` effect** — folded into `Modifier` with `attribute: "power" | "toughness"`; one effect kind for every attribute change.
- **`*PowerGrowth` attribute family** (18 entries — `FirePowerGrowth` through `BeastPowerGrowth` plus `AllPowerGrowth`) — replaced with `Triggered OnTurnStart → GainElement <slug> +N`. Growth rate is now emergent from OnTurnStart effects on the hero, not a stored attribute.
- **`Charge`** — split into two forms: self-charge as `Triggered OnPlay → AttackNow` (Fire Drake, Priestess of Moments, Time Dragon); granted charge as `ApplyStatus { status: "Charge", duration: "thisTurn" }` on the recipient (Merfolk Overlord to neighbors). The status is a permission flag; `AttackNow` is an immediate action.
- **`ReflectDamage`, `ImmuneToSpells`, `RedirectDamageTo`** — replaced with replacement-effect triggers (`OnBeforeDamage → ReflectDamage`, `OnBeforeSpellDamage → PreventDamage`, `OnBeforeDamage → RedirectDamage`).
- **`targetIsOpponent` flag on `GainElement`** — gone. The outer ability's `target` determines whose pool is affected; Weakness / Poisonous Cloud / Ancient Witch now target `EnemyHero` and apply negative `GainElement` directly.
- **Expression types `ElementPower`, `AttributeOf`, `EventValue`, `HasTrait`, `IsMinion`, etc.** — collapsed into one `{ operator, args }` grammar over `{ key, scope }` references. `Count`, `Half`, `Min`, `RandomRange`, `ConditionalExpr` all share the same operator-plus-args node shape.
- **Predicate kinds (`And`, `Not`, `Lt`, etc.)** — same grammar as arithmetic expressions; filters and amounts speak one language.

### Runtime vocabulary the engine still owns

These stay as engine-specific tokens resolved at invocation time:

- **`RandomElement`** as an element string — runtime random selection (Insanian Shaman, Goblin Looter, Ratmaster).
- **`HighestOpponentElement`** — dynamic element reference (Mana Burn).
- **`AllElements`** — broadcast over all elements (Ancient Dragon, Mind Master via absorbed `AllPowerGrowth`).
- **`MoveSelfTo`, `SwapPosition`, `ForceAttack`, `MoveToRandomSlot`, `SkipOpponentTurn`, `RecordAttribute`** — effects Spectromancer needs; Codex invokes them by name.

### Cards that required notable mechanics beyond MVP

- **Elementals** (Fire/Water/Air/Earth) — stats as `{ key: <element>, scope: "OwnerHero" }`.
- **Golem Instructor** — stats as `{ operator: "count", args: [...] }`.
- **Dark Sculptor**, **Goblin Hero** — damage / attack scaled by `count` over creature sets.
- **Oracle**, **Lightning Bolt**, **Armageddon**, **Greater Demon** — damage scaling by element-power reference, with `min` clamp for Greater Demon.
- **Drain Souls**, **HellFire**, **Blood Boil** — event-value propagation (`{ key: "killedCount", scope: "Event" }`).
- **Blood Ritual** — in-effect attribute capture (`RecordAttribute` before `Destroy`).
- **Forest Wolf** — conditional stat at summon via `{ operator: "if", args: [...] }`.
- **Ancient Horror**, **Basilisk** — filter predicates comparing two references (target attr vs. element power).
- **Timeweaver**, **Chrono Engine** — `whilePresent` modifier on `SpellCost` / `CardsPerTurn`.
- **Vampiric set** — multi-component costs (Element + Life).
- **Beast set** — `{ kind: "Activated", cost: [{ kind: "Tap" }] }` triggers.
- **Mindstealer, Wall of Reflection, Steel Golem, Ice Golem, Golem (token)** — replacement effects under `OnBeforeDamage` / `OnBeforeSpellDamage`.
- **Fire Drake, Priestess of Moments, Time Dragon** — Charge absorbed into `OnPlay → AttackNow`.

### Cards that strained the shape

Nothing failed outright. The stretches, all now uniformly expressed as engine-vocabulary extensions rather than separate constructs:

- **Hypnosis** (opponent's strongest creatures attack opponent) — needed `AttackOwnHero` status and a `StrongestEnemyByAttack` selector with a `count` parameter.
- **Monument to Rage** — `AttacksPerTurn` attribute plus an `AllyDealtDamage` event carrying `damageDealt` in its payload.
- **Phoenix** — the revival condition ("unless Destroyed") needed a `killedBy` event field, read via `{ key: "killedBy", scope: "Event" }`.
- **Emissary of Dorlak** — the "must sacrifice on play" constraint is encoded as a single `OnPlay → Destroy` ability targeting `ChosenAlly` with `"required": true`. The flag makes the ability non-skippable: if no ally can be chosen, the card cannot be cast.
- **Justicar** — "double damage to opposing" uses a `DamageToOpposing` modifier attribute; a general multi-target damage multiplier would subsume it.

All of these slot in as open extensions of existing vocabularies — open `Modifier.attribute` names, open `OnEvent` event types, open scope tokens. The engine-agnostic principle from [Research-001](./Research-001_cross-game-data-model.md) carries through: the DSL shape is fixed; the engine's published vocabulary is what grows.

## Caveats

- Card numbers (damage, heal, growth deltas) are best-effort. Source text was paraphrased at fetch time; canonical values need verification against the live Spectromancer source before this catalog is used for anything beyond demonstration.
- The set includes creatures spawned by other cards (Scrambled Lemure, Enraged Quartermaster, Demon Apostate, Soldier, Forest Spider, Bee Soldier, Initiate, Magic Rabbit). These have stats but may have additional behaviors not fully documented in the fetched paraphrases.
- Shorthand notation (bare string for `target`, shortcut cost object, bare numbers for literal expressions) is catalog convenience; the longhand form is what the schema validates.
- Engine-specific tokens (`RandomElement`, `HighestOpponentElement`, `AllElements`, effects like `MoveSelfTo` / `ForceAttack`, attributes like `DamageTakenFromSpells`) are under the engine-agnostic framing from Research-001 — the engine publishes these via its function / attribute registry; Codex stores the invocations.
