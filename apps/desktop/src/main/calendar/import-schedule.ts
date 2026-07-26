import { promises as fs } from 'node:fs';

import type { Schedule as ScheduleInterface } from '@croffledev/croffle-types';

import { openJsonFileDialog } from '../window/json-file-dialog';
import { createSchedule, updateSchedule } from './schedule-service';
import { scheduleMapper } from '../mapper/schedule-mapper';

import { databaseManager } from '../database';
import { Schedule as ScheduleEntity } from '../database/schema/schedule.entity';
import type { ExportShapeV1 } from './export.type';

export async function importScheduleFromFile(
  mode: 'merge' | 'duplicate' = 'merge',
): Promise<{ created: number; updated: number } | null> {
  const filePath = await openJsonFileDialog({ title: 'Import schedules' });
  if (!filePath) {
    return null;
  }

  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as ExportShapeV1 | ScheduleInterface[];

  // 허용 포맷:
  // 1) { version, exportedAt, schedules: [...] }
  // 2) Schedule[] 단독 배열
  const schedules: ScheduleInterface[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.schedules)
      ? parsed.schedules
      : [];

  if (schedules.length === 0) {
    throw new Error('Import file has no schedules');
  }

  const repo = databaseManager.getRepository(ScheduleEntity);

  let created = 0;
  let updated = 0;

  for (const s of schedules) {
    const entityData = scheduleMapper.toEntity(s);

    if (mode === 'duplicate') {
      await createSchedule(entityData);
      created += 1;
      continue;
    }

    // merge: id 기반 upsert
    if (s.id) {
      const exists = await repo.findOne({ where: { id: s.id } });
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
