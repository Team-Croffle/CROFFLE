import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import * as path from 'path';
import { app } from 'electron';
// Tag entity import
// Schedule entity import
// Search Query entity import
// PluginInfo entity import
// Application Settings entity import

class DatabaseManager {
  private dataSource: DataSource;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'croffledb.sqlite');

    console.log(`[DB] Database path: ${dbPath}`);

    this.dataSource = new DataSource({
      type: 'sqlite',
      database: dbPath,
      entities: [
        // Tag entity
        // Schedule entity
        // Search Query entity
        // PluginInfo entity
        // Application Settings entity
      ],
      synchronize: true,
      logging: false,
    });
  }

  public async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize();
        console.log('[DB] Database initialized successfully.');
      } catch (error) {
        console.error('[DB] Error during database initialization:', error);
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
    const repository = this.dataSource.getRepository(entity.constructor.name) as Repository<T>;
    const result = await repository.save(entity);
    return result;
  }
}

export const databaseManager = new DatabaseManager();
