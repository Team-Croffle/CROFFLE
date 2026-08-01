import { assertSchemaMatch, type AssertSchema, type TagEntity } from '@croffledev/common';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tags = sqliteTable('tag', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').notNull(),
});

export type TagRow = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

assertSchemaMatch<AssertSchema<TagRow, TagEntity>>();
