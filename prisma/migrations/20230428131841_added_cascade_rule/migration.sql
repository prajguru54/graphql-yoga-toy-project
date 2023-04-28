-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Link_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Link" ("authorId", "createdAt", "description", "id", "url") SELECT "authorId", "createdAt", "description", "id", "url" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "body" TEXT NOT NULL,
    "linkId" INTEGER,
    CONSTRAINT "Comment_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("body", "id", "linkId") SELECT "body", "id", "linkId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
