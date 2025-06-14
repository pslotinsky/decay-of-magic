/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MagicSchool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_schoolId_fkey";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "MagicSchool";

-- CreateTable
CREATE TABLE "mana" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "mana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT,
    "mana_id" TEXT NOT NULL,

    CONSTRAINT "mage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "mana_id" TEXT NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mage" ADD CONSTRAINT "mage_mana_id_fkey" FOREIGN KEY ("mana_id") REFERENCES "mana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_mana_id_fkey" FOREIGN KEY ("mana_id") REFERENCES "mana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
