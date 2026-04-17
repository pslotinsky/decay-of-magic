-- CreateTable
CREATE TABLE "universe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover" TEXT,

    CONSTRAINT "universe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "universe_name_key" ON "universe"("name");
