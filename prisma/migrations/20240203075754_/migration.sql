/*
  Warnings:

  - The values [DATA,PRODUCT_MANAGEMENT] on the enum `Stack` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Stack_new" AS ENUM ('PRODUCT_DESIGN', 'GRAPHICS', 'WEB', 'CLOUD');
ALTER TABLE "IOTBTechFellowship" ALTER COLUMN "stack" TYPE "Stack_new" USING ("stack"::text::"Stack_new");
ALTER TYPE "Stack" RENAME TO "Stack_old";
ALTER TYPE "Stack_new" RENAME TO "Stack";
DROP TYPE "Stack_old";
COMMIT;
