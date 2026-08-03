import type Database from 'better-sqlite3';

function dropColumnIfExists(sqlite: Database.Database, table: string, column: string): void {
  const columns = sqlite.pragma(`table_info(${table})`) as { name: string }[];
  if (!columns.some((c) => c.name === column)) {
    return;
  }
  sqlite.exec(`ALTER TABLE "${table}" DROP COLUMN "${column}"`);
}

/**
 * 스키마 생성은 drizzle migrate(0000+)가 담당한다.
 * 여기에는 마이그레이션으로 다루지 않는 레거시 정리만 둔다.
 */
export function applyLegacySchemaFixes(sqlite: Database.Database): void {
  // Legacy columns moved to on-disk croffle-manifest.json
  if (
    sqlite
      .prepare(`SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1`)
      .get('extension_info')
  ) {
    dropColumnIfExists(sqlite, 'extension_info', 'engines');
    dropColumnIfExists(sqlite, 'extension_info', 'contributes');
  }
}
