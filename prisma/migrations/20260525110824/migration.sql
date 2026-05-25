/*
  Warnings:

  - You are about to drop the column `avatar` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "avatar",
ADD COLUMN     "avatarUrl" TEXT;
