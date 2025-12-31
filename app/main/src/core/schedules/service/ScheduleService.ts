import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { databaseManager } from '../../../services/DatabaseManager';
import { Schedule } from '../model/Schedule';
import { stringValidation } from '../../helper/stringValidation';
import { colorValidation } from '../../helper/colorValidation';

export const scheduleService = {
  getSchedules: async (period: { start: string; end: string }): Promise<Schedule[]> => {
    const repo = databaseManager.getRepository(Schedule);
    const { start, end } = period;

    const schedules = await repo.find({
      where: {
        startDate: LessThanOrEqual(new Date(end)),
        endDate: MoreThanOrEqual(new Date(start)),
      },
      order: { startDate: 'ASC' },
      relations: ['tags'],
    });
    return schedules;
  },

  createSchedule: async (data: Partial<Schedule>): Promise<Schedule> => {
    const repo = databaseManager.getRepository(Schedule);

    if (!stringValidation(data.title ?? null, false, 100, 1)) {
      throw new Error('Title must be between 1 and 100 characters');
    }
    if (data.colorLabel && !colorValidation(data.colorLabel)) {
      throw new Error('Invalid color label format');
    }

    const newSchedule = repo.create(data);
    await repo.save(newSchedule);

    return newSchedule;
  },

  updateSchedule: async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
    const repo = databaseManager.getRepository(Schedule);

    const schedule = await repo.findOneBy({ id });
    if (!schedule) throw new Error('Schedule not found');

    if (data.title !== undefined && !stringValidation(data.title, false, 100, 1)) {
      throw new Error('Title must be between 1 and 100 characters');
    }
    if (data.colorLabel !== undefined && !colorValidation(data.colorLabel)) {
      throw new Error('Invalid color label format');
    }

    repo.merge(schedule, data);
    await repo.save(schedule);

    return schedule;
  },

  deleteSchedule: async (id: string): Promise<boolean> => {
    const repo = databaseManager.getRepository(Schedule);

    const schedule = await repo.findOneBy({ id });
    if (!schedule) throw new Error('Schedule not found');

    await repo.remove(schedule);
    return true;
  },
};
