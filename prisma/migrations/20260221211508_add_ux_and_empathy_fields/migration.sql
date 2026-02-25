/*
  Warnings:

  - You are about to drop the column `persona` on the `Project` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "personaName" TEXT,
    "personaImage" TEXT,
    "personaBio" TEXT,
    "painPoints" TEXT,
    "userJourneyData" TEXT,
    "empathySays" TEXT,
    "empathyThinks" TEXT,
    "empathyFeels" TEXT,
    "empathyDoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("category", "createdAt", "description", "id", "imageUrl", "painPoints", "techStack", "title", "userJourneyData") SELECT "category", "createdAt", "description", "id", "imageUrl", "painPoints", "techStack", "title", "userJourneyData" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
