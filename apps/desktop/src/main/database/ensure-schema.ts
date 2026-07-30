import type Database from 'better-sqlite3';

/** 앱 시작 시 테이블이 없으면 생성한다. */
export function ensureSchema(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS "tag" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "color" TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "tag_name_unique" ON "tag" ("name");

    CREATE TABLE IF NOT EXISTS "schedule" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "location" TEXT,
      "startDate" integer NOT NULL,
      "endDate" integer NOT NULL,
      "isAllDay" integer NOT NULL DEFAULT 0,
      "recurringRule" TEXT,
      "colorLabel" TEXT NOT NULL DEFAULT '#E1E1E1',
      "createdAt" integer NOT NULL,
      "updatedAt" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "schedule_tags" (
      "scheduleId" TEXT NOT NULL,
      "tagId" TEXT NOT NULL,
      PRIMARY KEY ("scheduleId", "tagId"),
      FOREIGN KEY ("scheduleId") REFERENCES "schedule" ("id") ON DELETE CASCADE,
      FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "extension_info" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "version" TEXT NOT NULL,
      "author" TEXT NOT NULL,
      "description" TEXT,
      "enabled" integer NOT NULL DEFAULT 1,
      "main" TEXT,
      "engines" TEXT,
      "contributes" TEXT
    );

    CREATE TABLE IF NOT EXISTS "extension_storage" (
      "extensionId" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "updatedAt" integer NOT NULL,
      PRIMARY KEY ("extensionId", "key")
    );
  `);
}
