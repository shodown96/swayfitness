/*
  Warnings:

  - A unique constraint covering the columns `[apiId]` on the table `plans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "plans_apiId_key" ON "plans"("apiId");
