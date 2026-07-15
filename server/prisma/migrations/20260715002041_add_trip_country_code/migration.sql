-- AlterTable
ALTER TABLE "public"."ItineraryItem" ALTER COLUMN "time" SET DEFAULT '00:00';

-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "countryCode" TEXT;
