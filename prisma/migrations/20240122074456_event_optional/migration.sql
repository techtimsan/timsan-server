-- DropForeignKey
ALTER TABLE "ExcoProfile" DROP CONSTRAINT "ExcoProfile_eventId_fkey";

-- AlterTable
ALTER TABLE "ExcoProfile" ALTER COLUMN "eventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ExcoProfile" ADD CONSTRAINT "ExcoProfile_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
