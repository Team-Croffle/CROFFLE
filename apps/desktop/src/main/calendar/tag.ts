import { randomUUID } from 'node:crypto';

import { and, eq, ne } from 'drizzle-orm';

import { databaseManager } from '../database';
import { tags, type TagRow } from '../database/schema';
import { colorValidation } from '../utils/color-validator';
import { stringValidation } from '../utils/string-validator';

export async function getAllTags(): Promise<TagRow[]> {
  const db = databaseManager.getDb();
  return db.select().from(tags);
}

export async function getTagByName(name: string): Promise<TagRow | null> {
  const db = databaseManager.getDb();
  const row = await db.query.tags.findFirst({
    where: eq(tags.name, name),
  });
  return row ?? null;
}

export async function createTag(name: string, color: string): Promise<TagRow> {
  const db = databaseManager.getDb();

  if (!stringValidation(name, false, 50, 1)) {
    throw new Error('Invalid tag name');
  }

  const existing = await db.query.tags.findFirst({
    where: eq(tags.name, name),
  });
  if (existing) {
    throw new Error('Tag with the same name already exists');
  }
  if (!colorValidation(color)) {
    throw new Error('Invalid color format');
  }

  const newTag: TagRow = { id: randomUUID(), name, color };
  await db.insert(tags).values(newTag);
  return newTag;
}

export async function modifyTag(id: string, name: string, color: string): Promise<TagRow> {
  const db = databaseManager.getDb();
  const tag = await db.query.tags.findFirst({
    where: eq(tags.id, id),
  });
  if (!tag) {
    throw new Error('Tag not found');
  }

  if (!stringValidation(name, false, 50, 1)) {
    throw new Error('Tag name must be between 1 and 50 characters');
  }

  const duplicate = await db.query.tags.findFirst({
    where: and(eq(tags.name, name), ne(tags.id, id)),
  });
  if (duplicate) {
    throw new Error('Another tag with the same name already exists');
  }

  if (!colorValidation(color)) {
    throw new Error('Invalid color format');
  }

  await db.update(tags).set({ name, color }).where(eq(tags.id, id));
  return { ...tag, name, color };
}

export async function removeTag(id: string): Promise<boolean> {
  const db = databaseManager.getDb();
  const tag = await db.query.tags.findFirst({
    where: eq(tags.id, id),
  });
  if (!tag) {
    throw new Error('Tag not found');
  }

  await db.delete(tags).where(eq(tags.id, id));
  return true;
}
