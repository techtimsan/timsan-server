/*
  Warnings:

  - The values [UNDERGRADUATE,POSTGRADUATE] on the enum `GraduationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GraduationStatus_new" AS ENUM ('GRADUATE', 'UNDER_GRADUATE', 'POST_GRADUATE');
ALTER TABLE "MemberProfile" ALTER COLUMN "graduationStatus" TYPE "GraduationStatus_new" USING ("graduationStatus"::text::"GraduationStatus_new");
ALTER TABLE "ExcoProfile" ALTER COLUMN "graduationStatus" TYPE "GraduationStatus_new" USING ("graduationStatus"::text::"GraduationStatus_new");
ALTER TYPE "GraduationStatus" RENAME TO "GraduationStatus_old";
ALTER TYPE "GraduationStatus_new" RENAME TO "GraduationStatus";
DROP TYPE "GraduationStatus_old";
COMMIT;
