/*
  Warnings:

  - Added the required column `attendeeId` to the `ConferenceAttendee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConferenceAttendee" DROP CONSTRAINT "ConferenceAttendee_id_fkey";

-- AlterTable
ALTER TABLE "ConferenceAttendee" ADD COLUMN     "attendeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ConferenceAttendee" ADD CONSTRAINT "ConferenceAttendee_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
