-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userDislikeId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userLikeId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "userLikeId" DROP NOT NULL,
ALTER COLUMN "userDislikeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userDislikeId_fkey" FOREIGN KEY ("userDislikeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userLikeId_fkey" FOREIGN KEY ("userLikeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
