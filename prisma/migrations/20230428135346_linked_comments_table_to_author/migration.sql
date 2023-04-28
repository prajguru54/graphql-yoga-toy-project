/*
  Warnings:

  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "body" TEXT NOT NULL,
    "linkId" INTEGER,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Comment_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("body", "id", "linkId") SELECT "body", "id", "linkId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
