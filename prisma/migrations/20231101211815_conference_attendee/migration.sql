/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `ConferenceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ConferenceAttendees` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ConferenceAttendeePaymentStatus" AS ENUM ('PAYMENT_SUCCESSFUL', 'PAYMENT_PENDING');

-- AlterEnum
BEGIN;
CREATE TYPE "ConferenceStatus_new" AS ENUM ('COMING_SOON', 'OVER');
ALTER TABLE "Conference" ALTER COLUMN "status" TYPE "ConferenceStatus_new" USING ("status"::text::"ConferenceStatus_new");
ALTER TYPE "ConferenceStatus" RENAME TO "ConferenceStatus_old";
ALTER TYPE "ConferenceStatus_new" RENAME TO "ConferenceStatus";
DROP TYPE "ConferenceStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ConferenceAttendees" DROP CONSTRAINT "ConferenceAttendees_conferenceId_fkey";

-- DropTable
DROP TABLE "ConferenceAttendees";

-- DropEnum
DROP TYPE "ConferenceAttendeeStatus";

-- CreateTable
CREATE TABLE "ConferenceAttendee" (
    "id" TEXT NOT NULL,
    "membershipType" "ConferenceMembershipType" NOT NULL,
    "paymentStatus" "ConferenceAttendeePaymentStatus" NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConferenceAttendee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConferenceAttendee" ADD CONSTRAINT "ConferenceAttendee_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceAttendee" ADD CONSTRAINT "ConferenceAttendee_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
