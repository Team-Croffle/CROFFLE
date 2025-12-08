import { Between } from 'typeorm';
import { databaseManager } from '../../../services/DatabaseManager';
import { Schedule } from '../model/Schedule';
import type { Schedule as ISchedule, Tag as ITag } from '@croffledev/croffle-common';

// 예시 겸 ScheduleService 구현
export const scheduleService = {
  async getSchedules(period: { start: string; end: string }): Promise<ISchedule[]> {
    const scheduleRepo = databaseManager.getRepository(Schedule);

    const schedules = await scheduleRepo.find({
      where: {
        // typeORM의 Between을 사용하여 기간 내의 일정 조회
        startDate: Between(new Date(period.start), new Date(period.end)),
      },
      relations: ['tags'], //  tags 관계도 함께 로드
    });

    // Entity -> DTO 변환 (Date 객체를 ISO string으로)
    return schedules.map((s) => ({
      ...s,
      startDate: s.startDate.toISOString(),
      endDate: s.endDate.toISOString(),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      tags: s.tags as ITag[],
    }));
  },
};
