/*
  Warnings:

  - A unique constraint covering the columns `[tripId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Note_tripId_key" ON "public"."Note"("tripId");
