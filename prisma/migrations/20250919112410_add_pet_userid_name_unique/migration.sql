/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Pet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pet_userId_name_key" ON "public"."Pet"("userId", "name");
