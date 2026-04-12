-- CreateTable
CREATE TABLE "citizen" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "citizen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citizen_permit" (
    "citizen_id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizen_permit_pkey" PRIMARY KEY ("citizen_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "citizen_nickname_key" ON "citizen"("nickname");

-- AddForeignKey
ALTER TABLE "citizen_permit" ADD CONSTRAINT "citizen_permit_citizen_id_fkey" FOREIGN KEY ("citizen_id") REFERENCES "citizen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
