/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ExcoProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ConferenceStatus" AS ENUM ('IN_PROGRESS');

-- AlterTable
ALTER TABLE "InstitutionProfile" ALTER COLUMN "avatarUrl" SET DEFAULT '';

-- AlterTable
ALTER TABLE "MemberProfile" ALTER COLUMN "otherNames" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PatronProfile" ALTER COLUMN "avatarUrl" SET DEFAULT '';

-- CreateTable
CREATE TABLE "Conference" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" "ConferenceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceAttendees" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,

    CONSTRAINT "ConferenceAttendees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExcoProfile_email_key" ON "ExcoProfile"("email");

-- AddForeignKey
ALTER TABLE "ConferenceAttendees" ADD CONSTRAINT "ConferenceAttendees_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
