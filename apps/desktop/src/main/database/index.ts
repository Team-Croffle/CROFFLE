import * as path from 'node:path';

import { is } from '@electron-toolkit/utils';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { app } from 'electron';

import type { PublicTypeIntegrity } from '../../common/assert-public-types';
import { logger } from '../logger';
import { ensureSchema } from './ensure-schema';
import * as schema from './schema';

export type { PublicTypeIntegrity };

export type AppDatabase = BetterSQLite3Database<typeof schema>;

class DatabaseManager {
  private sqlite: Database.Database | null = null;
  private db: AppDatabase | null = null;

  public async initialize(): Promise<void> {
    if (this.db) {
      return;
    }

    try {
      // const dbPath = path.join(app.getPath('userData'), 'croffle.db');
      const dbPath = is.dev
        ? path.join(process.cwd(), 'dev/croffle.db') // development mode, the db file is in the root of the output directory
        : path.join(app.getPath('userData'), 'croffle.db'); // production mode, the db file is in the user's data directory
      logger.debug('DB', `Database path: ${dbPath}`);

      this.sqlite = new Database(dbPath);
      this.sqlite.pragma('journal_mode = WAL');
      this.sqlite.pragma('foreign_keys = ON');

      ensureSchema(this.sqlite);

      this.db = drizzle(this.sqlite, { schema });
      logger.info('DB', 'Database initialized successfully.');
    } catch (error) {
      logger.error('DB', 'Error during database initialization:', error);
      throw error;
    }
  }

  public getDb(): AppDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }
}

export const databaseManager = new DatabaseManager();
