import * as path from 'node:path';

import { app } from 'electron';
import type { ObjectLiteral, Repository } from 'typeorm';
import { DataSource } from 'typeorm';

import { logger } from '../logger';
import { ExtensionInfo } from './schema/extension-info.entity';
import { ExtensionStorage } from './schema/extension-storage.entity';
import { Schedule } from './schema/schedule.entity';
import { Tag } from './schema/tag.entity';

class DatabaseManager {
  private dataSource: DataSource;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'croffledb.sqlite');

    logger.debug('DB', `Database path: ${dbPath}`);

    this.dataSource = new DataSource({
      type: 'better-sqlite3',
      database: dbPath,
      entities: [Tag, Schedule, ExtensionInfo, ExtensionStorage],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    });
  }

  public async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize();
        logger.info('DB', 'Database initialized successfully.');
      } catch (error) {
        logger.error('DB', 'Error during database initialization:', error);
        throw error;
      }
    }
  }

  public getRepository<T extends ObjectLiteral>(entity: new () => T): Repository<T> {
    if (!this.dataSource.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.dataSource.getRepository(entity);
  }

  public async save<T extends ObjectLiteral>(entity: T): Promise<T> {
    const repository = this.dataSource.getRepository(
      entity.constructor as new () => T,
    ) as Repository<T>;
    const result = await repository.save(entity);
    return result;
  }
}

export const databaseManager = new DatabaseManager();
