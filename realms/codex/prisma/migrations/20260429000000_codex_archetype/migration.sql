/*
  Warnings:

  - The placeholder `mage`, `mana`, and `card` tables are dropped in favor of
    the canonical Codex schema (a single `archetype` table discriminated by
    `kind`).
*/

-- DropForeignKey
ALTER TABLE "mage" DROP CONSTRAINT "mage_mana_id_fkey";

-- DropForeignKey
ALTER TABLE "card" DROP CONSTRAINT "card_mana_id_fkey";

-- DropTable
DROP TABLE "mage";

-- DropTable
DROP TABLE "card";

-- DropTable
DROP TABLE "mana";

-- CreateTable
CREATE TABLE "archetype" (
    "id" TEXT NOT NULL,
    "universe_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "archetype_pkey" PRIMARY KEY ("universe_id", "id")
);

-- CreateIndex
CREATE INDEX "archetype_universe_id_kind_idx" ON "archetype"("universe_id", "kind");
