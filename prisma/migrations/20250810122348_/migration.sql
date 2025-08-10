/*
  Warnings:

  - The values [annual] on the enum `PlanInterval` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanInterval_new" AS ENUM ('hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'biannually', 'annually');
ALTER TABLE "plans" ALTER COLUMN "interval" TYPE "PlanInterval_new" USING ("interval"::text::"PlanInterval_new");
ALTER TYPE "PlanInterval" RENAME TO "PlanInterval_old";
ALTER TYPE "PlanInterval_new" RENAME TO "PlanInterval";
DROP TYPE "PlanInterval_old";
COMMIT;
