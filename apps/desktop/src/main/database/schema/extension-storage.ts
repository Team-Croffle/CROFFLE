import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const extensionStorage = sqliteTable(
  'extension_storage',
  {
    extensionId: text('extensionId').notNull(),
    key: text('key').notNull(),
    value: text('value').notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.extensionId, t.key] })],
);

export type ExtensionStorage = typeof extensionStorage.$inferSelect;
export type NewExtensionStorage = typeof extensionStorage.$inferInsert;
