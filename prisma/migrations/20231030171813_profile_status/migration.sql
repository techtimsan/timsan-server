/*
  Warnings:

  - The values [GRADUATED] on the enum `GraduationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - Added the required column `emailVerified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `profileStatus` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('NOT_COMPLETED', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "GraduationStatus_new" AS ENUM ('GRADUATE', 'UNDERGRADUATE', 'POSTGRADUATE');
ALTER TABLE "MemberProfile" ALTER COLUMN "graduationStatus" TYPE "GraduationStatus_new" USING ("graduationStatus"::text::"GraduationStatus_new");
ALTER TABLE "ExcoProfile" ALTER COLUMN "graduationStatus" TYPE "GraduationStatus_new" USING ("graduationStatus"::text::"GraduationStatus_new");
ALTER TYPE "GraduationStatus" RENAME TO "GraduationStatus_old";
ALTER TYPE "GraduationStatus_new" RENAME TO "GraduationStatus";
DROP TYPE "GraduationStatus_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Zone" ADD VALUE 'NORTH_WEST';
ALTER TYPE "Zone" ADD VALUE 'NORTH_CENTRAL';
ALTER TYPE "Zone" ADD VALUE 'NORTH_EAST';

-- AlterTable
ALTER TABLE "ExcoProfile" ALTER COLUMN "otherNames" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL,
DROP COLUMN "profileStatus",
ADD COLUMN     "profileStatus" "ProfileStatus" NOT NULL;
