/*
  Warnings:

  - You are about to drop the column `date` on the `ItineraryItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ItineraryItem" DROP COLUMN "date",
ADD COLUMN     "time" TEXT;
