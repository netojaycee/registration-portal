/*
  Warnings:

  - You are about to drop the column `memberType` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Registration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accommodation` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationCareer` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membershipStatus` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modeOfAttendance` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Registration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Registration_phone_key";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "memberType",
DROP COLUMN "phone",
ADD COLUMN     "accommodation" TEXT NOT NULL,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "area" TEXT,
ADD COLUMN     "classDivision" TEXT,
ADD COLUMN     "classLevel" TEXT,
ADD COLUMN     "cluster" TEXT,
ADD COLUMN     "educationCareer" TEXT NOT NULL,
ADD COLUMN     "faculty" TEXT,
ADD COLUMN     "job" TEXT,
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "membershipStatus" TEXT NOT NULL,
ADD COLUMN     "modeOfAttendance" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "branch" DROP NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_phoneNumber_key" ON "Registration"("phoneNumber");
