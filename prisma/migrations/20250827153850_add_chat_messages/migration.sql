/*
  Warnings:

  - You are about to drop the column `pricePerGramINR` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `channel` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerGram` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grams" REAL NOT NULL,
    "amountINR" INTEGER NOT NULL,
    "pricePerGram" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("amountINR", "createdAt", "grams", "id", "userId") SELECT "amountINR", "createdAt", "grams", "id", "userId" FROM "Purchase";
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
