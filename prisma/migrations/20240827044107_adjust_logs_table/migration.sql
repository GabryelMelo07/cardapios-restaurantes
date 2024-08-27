/*
  Warnings:

  - Added the required column `method` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL
);
INSERT INTO "new_Logs" ("action", "date", "description", "id") SELECT "action", "date", "description", "id" FROM "Logs";
DROP TABLE "Logs";
ALTER TABLE "new_Logs" RENAME TO "Logs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
