/*
  Warnings:

  - Changed the type of `urlCode` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "urlCode",
ADD COLUMN     "urlCode" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CategoryUrlCode";

-- CreateIndex
CREATE UNIQUE INDEX "categories_urlCode_key" ON "categories"("urlCode");

-- CreateIndex
CREATE INDEX "categories_urlCode_idx" ON "categories"("urlCode");
