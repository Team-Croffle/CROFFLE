import { promises as fs } from 'node:fs';

import type { Schedule as ScheduleInterface } from '@croffledev/common';
import { eq } from 'drizzle-orm';

import { databaseManager } from '../database';
import { schedules } from '../database/schema';
import { scheduleMapper } from '../mapper/schedule-mapper';
import { openJsonFileDialog } from '../window/json-file-dialog';
import type { ExportShapeV1 } from './export.type';
import { createSchedule, updateSchedule } from './schedule-service';

export async function importScheduleFromFile(
  mode: 'merge' | 'duplicate' = 'merge',
): Promise<{ created: number; updated: number } | null> {
  const filePath = await openJsonFileDialog({ title: 'Import schedules' });
  if (!filePath) {
    return null;
  }

  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as ExportShapeV1 | ScheduleInterface[];

  const scheduleList: ScheduleInterface[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.schedules)
      ? parsed.schedules
      : [];

  if (scheduleList.length === 0) {
    throw new Error('Import file has no schedules');
  }

  const db = databaseManager.getDb();

  let created = 0;
  let updated = 0;

  for (const s of scheduleList) {
    const entityData = scheduleMapper.toEntity(s);

    if (mode === 'duplicate') {
      await createSchedule(entityData);
      created += 1;
      continue;
    }

    if (s.id) {
      const exists = await db.query.schedules.findFirst({
        where: eq(schedules.id, s.id),
      });
      if (exists) {
        await updateSchedule(s.id, entityData);
        updated += 1;
        continue;
      }
    }

    await createSchedule(entityData);
    created += 1;
  }

  return { created, updated };
}
