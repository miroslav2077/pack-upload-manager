/*
  Warnings:

  - Added the required column `mimeType` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('LOCAL', 'CLOUD');

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "storage" "StorageType" NOT NULL DEFAULT 'CLOUD';
