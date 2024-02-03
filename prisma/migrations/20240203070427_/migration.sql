-- CreateEnum
CREATE TYPE "CurrentJobSituation" AS ENUM ('STUDENT', 'EMPLOYED', 'UNEMPLOYED', 'SELF_EMPLOYED');

-- CreateEnum
CREATE TYPE "EducationalBackground" AS ENUM ('O_LEVEL', 'BSC', 'MSC', 'ASSOCIATE', 'PHD', 'PROFESSIONAL_CERTIFICATION', 'OTHERS');

-- CreateEnum
CREATE TYPE "ITSkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "CollaborationTool" AS ENUM ('ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS', 'FREE_CONFERENCE_CALL', 'SLACKS', 'OTHERS');

-- CreateEnum
CREATE TYPE "Stack" AS ENUM ('PRODUCT_DESIGN', 'GRAPHICS', 'WEB', 'CLOUD', 'DATA', 'PRODUCT_MANAGEMENT');

-- CreateTable
CREATE TABLE "IOTBTechFellowship" (
    "id" TEXT NOT NULL,
    "currentJobSituation" "CurrentJobSituation" NOT NULL,
    "stateOfResidence" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institutionOrCompany" TEXT,
    "educationalBackground" "EducationalBackground" NOT NULL,
    "itSkillLevel" "ITSkillLevel" NOT NULL,
    "specialization" TEXT,
    "mentor" BOOLEAN NOT NULL,
    "ownLaptop" BOOLEAN NOT NULL,
    "laptopSpec" TEXT NOT NULL,
    "committed" BOOLEAN NOT NULL,
    "challenge" TEXT NOT NULL,
    "techJourney" TEXT NOT NULL,
    "realtimeSolution" TEXT NOT NULL,
    "collaborationTool" "CollaborationTool" NOT NULL,
    "feedbackAndInquiry" TEXT NOT NULL,
    "stack" "Stack" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IOTBTechFellowship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IOTBTechFellowship" ADD CONSTRAINT "IOTBTechFellowship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
