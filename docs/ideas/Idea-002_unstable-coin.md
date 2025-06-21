# Idea-002: Unstable coin

| Field   | Value      |
| ------- | ---------- |
| Tags    | `random`   |
| Created | 2025-06-21 |

## Description

**Unstable Coin (UC)** is an in-game currency awarded for victories in battles, participation in events, and other achievements. It has no practical use other than reflecting rating, status, and meme-worthy significance.

Since money is being dug out of thin air, its quantity is constantly growing and is not backed by anything. This leads to a rapid devaluation of the game currency. More money is being paid for tasks, which leads to even greater inflation

Rating tables built on this principle will be constantly updated. Yesterday's rich people are today's paupers!

This is an intentional part of the lore and game design.

## Inflation Mechanics and Overflow Protection

### 🔥 Denomination

- When the total UC in circulation reaches a certain threshold (e.g. `1_000_000_000_000_000`), a "**Great Denomination**" is triggered.
- All balances are reduced by 10⁶.
- Players are notified of entering a new economic era.
- Historical rankings are preserved before the denomination.

### 🌐 Currency Evolution

- When even greater quantities are reached, a **new currency** tier is introduced.

| Stage | Currency         | Transition Threshold |
| ----- | ---------------- | -------------------- |
| 1     | Unstable Coin    | base currency        |
| 2     | Hyper Coin       | 1e18 UC              |
| 3     | Quantum Token    | 1e18 HC              |
| 4     | Dust Fragment    | 1e18 QT              |
| 5     | Screams of Value | 1e18 DF              |

Players see their balance in a hierarchical format, e.g.: `2 QT, 433 HC, 3_000_000 UC`

## Usage

- The currency has **no economic function**.
- It is used for:
  - showing **player ranking** (the wealthiest on top)
