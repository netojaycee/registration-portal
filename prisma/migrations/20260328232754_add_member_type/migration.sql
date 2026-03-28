-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('member', 'visitor');

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "memberType" "MemberType" NOT NULL DEFAULT 'member';
