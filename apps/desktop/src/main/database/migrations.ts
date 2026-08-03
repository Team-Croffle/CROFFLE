import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import * as path from 'node:path';

import { is } from '@electron-toolkit/utils';
import type Database from 'better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { app } from 'electron';

import { logger } from '../logger';
import type * as schema from './schema';

type Journal = {
  entries: { tag: string; when: number }[];
};

const MIGRATIONS_TABLE = '__drizzle_migrations';

/** 개발/패키징 환경에 맞는 drizzle 마이그레이션 폴더 절대 경로 */
export function getMigrationsFolder(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'drizzle');
  }

  // electron-vite dev: cwd = apps/desktop
  const fromCwd = path.join(process.cwd(), 'drizzle');
  if (existsSync(path.join(fromCwd, 'meta', '_journal.json'))) {
    return fromCwd;
  }

  // 메인 번들 기준 상대 탐색 (out/main → apps/desktop)
  const fromAppPath = path.join(app.getAppPath(), 'drizzle');
  if (existsSync(path.join(fromAppPath, 'meta', '_journal.json'))) {
    return fromAppPath;
  }

  // 최후: monorepo 루트에서 desktop 기준
  return path.join(process.cwd(), 'apps', 'desktop', 'drizzle');
}

function tableExists(sqlite: Database.Database, table: string): boolean {
  const row = sqlite
    .prepare(`SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1`)
    .get(table) as { ok: number } | undefined;
  return Boolean(row);
}

function columnExists(sqlite: Database.Database, table: string, column: string): boolean {
  const columns = sqlite.pragma(`table_info(${table})`) as { name: string }[];
  return columns.some((c) => c.name === column);
}

function readJournal(migrationsFolder: string): Journal {
  const journalPath = path.join(migrationsFolder, 'meta', '_journal.json');
  return JSON.parse(readFileSync(journalPath, 'utf8')) as Journal;
}

function migrationHash(migrationsFolder: string, tag: string): string {
  const sql = readFileSync(path.join(migrationsFolder, `${tag}.sql`), 'utf8');
  return createHash('sha256').update(sql).digest('hex');
}

function ensureMigrationsTable(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS "${MIGRATIONS_TABLE}" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash text NOT NULL,
      created_at numeric
    )
  `);
}

function migrationRowCount(sqlite: Database.Database): number {
  if (!tableExists(sqlite, MIGRATIONS_TABLE)) {
    return 0;
  }
  const row = sqlite.prepare(`SELECT COUNT(*) AS c FROM "${MIGRATIONS_TABLE}"`).get() as {
    c: number;
  };
  return row.c;
}

/**
 * ensureSchema / 구버전으로 이미 테이블이 있는 DB는 0000(CREATE)을 건너뛰도록
 * journal의 해당 항목을 적용 완료로 기록한다.
 */
function baselineExistingDatabase(sqlite: Database.Database, migrationsFolder: string): void {
  if (!tableExists(sqlite, 'schedule')) {
    return;
  }

  ensureMigrationsTable(sqlite);
  if (migrationRowCount(sqlite) > 0) {
    return;
  }

  const journal = readJournal(migrationsFolder);
  const first = journal.entries[0];
  if (!first) {
    return;
  }

  const insert = sqlite.prepare(
    `INSERT INTO "${MIGRATIONS_TABLE}" ("hash", "created_at") VALUES (?, ?)`,
  );
  insert.run(migrationHash(migrationsFolder, first.tag), first.when);
  logger.info('DB', `Baselined migration ${first.tag} for existing database.`);

  // 이미 priority 컬럼이 있으면 0001도 스킵
  const second = journal.entries[1];
  if (second && columnExists(sqlite, 'schedule', 'priority')) {
    insert.run(migrationHash(migrationsFolder, second.tag), second.when);
    logger.info('DB', `Baselined migration ${second.tag} (priority already present).`);
  }

  const third = journal.entries[2];
  if (third && columnExists(sqlite, 'schedule', 'reminderMinutes')) {
    insert.run(migrationHash(migrationsFolder, third.tag), third.when);
    logger.info('DB', `Baselined migration ${third.tag} (reminderMinutes already present).`);
  }
}

export function runMigrations(
  sqlite: Database.Database,
  db: BetterSQLite3Database<typeof schema>,
): void {
  const migrationsFolder = getMigrationsFolder();
  const journalPath = path.join(migrationsFolder, 'meta', '_journal.json');

  if (!existsSync(journalPath)) {
    throw new Error(`Drizzle migrations folder not found: ${migrationsFolder}`);
  }

  logger.debug('DB', `Migrations folder: ${migrationsFolder} (dev=${is.dev})`);

  baselineExistingDatabase(sqlite, migrationsFolder);
  migrate(db, { migrationsFolder });
  logger.info('DB', 'Database migrations applied.');
}
