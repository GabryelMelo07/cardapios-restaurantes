/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN "image" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");
