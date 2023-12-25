-- CreateEnum
CREATE TYPE "BookCategory" AS ENUM ('FAYDAH_BOOKS', 'POETRY', 'SEERAH', 'HADITH', 'FIQH', 'PROJECTS_OR_MAGAZINES', 'ARTICLES');

-- CreateEnum
CREATE TYPE "TiletCourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "category" "BookCategory" NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiletCourse" (
    "id" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "level" "TiletCourseLevel" NOT NULL,
    "rating" INTEGER NOT NULL,
    "instructor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TiletCourse_pkey" PRIMARY KEY ("id")
);
