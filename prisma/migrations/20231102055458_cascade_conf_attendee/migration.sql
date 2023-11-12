-- DropForeignKey
ALTER TABLE "ConferenceAttendee" DROP CONSTRAINT "ConferenceAttendee_conferenceId_fkey";

-- AddForeignKey
ALTER TABLE "ConferenceAttendee" ADD CONSTRAINT "ConferenceAttendee_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
