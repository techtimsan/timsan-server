/*
  Warnings:

  - Added the required column `status` to the `ExcoProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `NecProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ZoneProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExcoStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "ExcoProfile" ADD COLUMN     "status" "ExcoStatus" NOT NULL;

-- AlterTable
ALTER TABLE "NecProfile" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscribedNewsletter" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ZoneProfile" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- AddForeignKey
ALTER TABLE "ZoneProfile" ADD CONSTRAINT "ZoneProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NecProfile" ADD CONSTRAINT "NecProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
