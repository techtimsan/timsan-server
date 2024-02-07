/*
  Warnings:

  - Added the required column `pcHours` to the `IOTBTechFellowship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeklyHours` to the `IOTBTechFellowship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IOTBTechFellowship" ADD COLUMN     "pcHours" INTEGER NOT NULL,
ADD COLUMN     "weeklyHours" INTEGER NOT NULL;
