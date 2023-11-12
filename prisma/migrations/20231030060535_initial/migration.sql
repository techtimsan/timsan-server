-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('MEMBER', 'INSTITUTION', 'STATE', 'ZONAL', 'NEC');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "GraduationStatus" AS ENUM ('GRADUATED');

-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('SOUTH_WEST');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('APPROVED', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL DEFAULT 'MEMBER',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "emailToken" TEXT NOT NULL,
    "profileStatus" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberProfile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "otherNames" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "course" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "graduationStatus" "GraduationStatus" NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "stateOfResidence" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institutionProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionProfile" (
    "id" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" INTEGER NOT NULL,
    "long" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "stateProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcoProfile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "otherNames" TEXT NOT NULL,
    "courseOfStudy" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "graduationStatus" "GraduationStatus" NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "stateOfResidence" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "stateProfileId" TEXT NOT NULL,
    "zoneProfileId" TEXT NOT NULL,
    "necProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcoProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatronProfile" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "otherNames" TEXT,
    "occupation" TEXT NOT NULL,
    "placeOfWork" TEXT NOT NULL,
    "stateOfResidence" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "stateProfileId" TEXT NOT NULL,
    "zoneProfileId" TEXT NOT NULL,
    "necProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatronProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "desc" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "stateProfileId" TEXT NOT NULL,
    "zoneProfileId" TEXT NOT NULL,
    "necProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "estimatedBudget" INTEGER NOT NULL,
    "institutionId" TEXT NOT NULL,
    "stateProfileId" TEXT NOT NULL,
    "zoneProfileId" TEXT NOT NULL,
    "necProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateProfile" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "zoneProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StateProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneProfile" (
    "id" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NecProfile" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NecProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingList" (
    "email" TEXT NOT NULL,

    CONSTRAINT "MailingList_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Broadcast" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "author" TEXT NOT NULL,

    CONSTRAINT "Broadcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "userLikeId" TEXT NOT NULL,
    "userDislikeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionProfile_email_key" ON "InstitutionProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StateProfile_email_key" ON "StateProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ZoneProfile_email_key" ON "ZoneProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NecProfile_email_key" ON "NecProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MailingList_email_key" ON "MailingList"("email");

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_institutionProfileId_fkey" FOREIGN KEY ("institutionProfileId") REFERENCES "InstitutionProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionProfile" ADD CONSTRAINT "InstitutionProfile_stateProfileId_fkey" FOREIGN KEY ("stateProfileId") REFERENCES "StateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionProfile" ADD CONSTRAINT "InstitutionProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcoProfile" ADD CONSTRAINT "ExcoProfile_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcoProfile" ADD CONSTRAINT "ExcoProfile_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcoProfile" ADD CONSTRAINT "ExcoProfile_stateProfileId_fkey" FOREIGN KEY ("stateProfileId") REFERENCES "StateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcoProfile" ADD CONSTRAINT "ExcoProfile_zoneProfileId_fkey" FOREIGN KEY ("zoneProfileId") REFERENCES "ZoneProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcoProfile" ADD CONSTRAINT "ExcoProfile_necProfileId_fkey" FOREIGN KEY ("necProfileId") REFERENCES "NecProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronProfile" ADD CONSTRAINT "PatronProfile_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronProfile" ADD CONSTRAINT "PatronProfile_stateProfileId_fkey" FOREIGN KEY ("stateProfileId") REFERENCES "StateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronProfile" ADD CONSTRAINT "PatronProfile_zoneProfileId_fkey" FOREIGN KEY ("zoneProfileId") REFERENCES "ZoneProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronProfile" ADD CONSTRAINT "PatronProfile_necProfileId_fkey" FOREIGN KEY ("necProfileId") REFERENCES "NecProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_stateProfileId_fkey" FOREIGN KEY ("stateProfileId") REFERENCES "StateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_zoneProfileId_fkey" FOREIGN KEY ("zoneProfileId") REFERENCES "ZoneProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_necProfileId_fkey" FOREIGN KEY ("necProfileId") REFERENCES "NecProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_stateProfileId_fkey" FOREIGN KEY ("stateProfileId") REFERENCES "StateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_zoneProfileId_fkey" FOREIGN KEY ("zoneProfileId") REFERENCES "ZoneProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_necProfileId_fkey" FOREIGN KEY ("necProfileId") REFERENCES "NecProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateProfile" ADD CONSTRAINT "StateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateProfile" ADD CONSTRAINT "StateProfile_zoneProfileId_fkey" FOREIGN KEY ("zoneProfileId") REFERENCES "ZoneProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userLikeId_fkey" FOREIGN KEY ("userLikeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userDislikeId_fkey" FOREIGN KEY ("userDislikeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
