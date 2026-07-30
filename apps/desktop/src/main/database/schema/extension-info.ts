import type {
  ExtensionContributes,
  ExtensionInfo as ExtensionInfoInterface,
} from '@croffledev/croffle-types';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type ExtensionEngines = NonNullable<ExtensionInfoInterface['engines']>;

export const extensionInfo = sqliteTable('extension_info', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  author: text('author').notNull(),
  description: text('description'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  main: text('main'),
  engines: text('engines', { mode: 'json' }).$type<ExtensionEngines>(),
  contributes: text('contributes', { mode: 'json' }).$type<ExtensionContributes>(),
});

export type ExtensionInfo = typeof extensionInfo.$inferSelect;
export type NewExtensionInfo = typeof extensionInfo.$inferInsert;
