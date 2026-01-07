import { LessThanOrEqual, MoreThanOrEqual, FindOptionsWhere } from 'typeorm';
import { databaseManager } from '../../../services/DatabaseManager';
import { Schedule } from '../model/Schedule';
import { stringValidation } from '../../helper/stringValidation';
import { colorValidation } from '../../helper/colorValidation';

const validateScheduleData = (schedule: Schedule) => {
  // 제목 검증 (필수, 1~100자)
  if (schedule.title !== undefined && !stringValidation(schedule.title, false, 100, 1)) {
    throw new Error('Title must be between 1 and 100 characters');
  }

  // 색상 검증 (Hex Code)
  if (schedule.colorLabel !== undefined && !colorValidation(schedule.colorLabel)) {
    throw new Error('Invalid color label format');
  }

  // 설명 검증 (선택, 최대 2000자)
  if (schedule.description && !stringValidation(schedule.description, true, 2000, 0)) {
    throw new Error('Description must be less than 2000 characters');
  }

  // 장소 검증 (선택, 최대 200자)
  if (schedule.location && !stringValidation(schedule.location, true, 200, 0)) {
    throw new Error('Location must be less than 200 characters');
  }

  // 날짜 순서 검증
  if (schedule.startDate && schedule.endDate) {
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    if (start > end) {
      throw new Error('Start date cannot be later than end date');
    }
  }
};

export const scheduleService = {
  getSchedules: async (period: { start: Date; end: Date }): Promise<Schedule[]> => {
    const repo = databaseManager.getRepository(Schedule);
    const { start, end } = period;

    let whereCondition: FindOptionsWhere<Schedule> = {};

    if (start && end) {
      whereCondition = {
        endDate: MoreThanOrEqual(start),
        startDate: LessThanOrEqual(end),
      };
    } else if (start) {
      whereCondition = { endDate: MoreThanOrEqual(start) };
    } else if (end) {
      whereCondition = { startDate: LessThanOrEqual(end) };
    }

    return await repo.find({
      where: whereCondition,
      order: { startDate: 'ASC' },
      relations: ['tags'],
    });
  },

  createSchedule: async (data: Partial<Schedule>): Promise<Schedule> => {
    const repo = databaseManager.getRepository(Schedule);

    if (!data.title) throw new Error('Title is required');
    if (!data.startDate || !data.endDate) throw new Error('Date range is required');

    validateScheduleData(data as Schedule);

    const newSchedule = repo.create(data);
    await repo.save(newSchedule);

    return newSchedule;
  },

  updateSchedule: async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
    const repo = databaseManager.getRepository(Schedule);

    const schedule = await repo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!schedule) throw new Error('Schedule not found');

    repo.merge(schedule, data);

    validateScheduleData(schedule);

    await repo.save(schedule);

    return schedule;
  },

  deleteSchedule: async (id: string): Promise<boolean> => {
    const repo = databaseManager.getRepository(Schedule);
    const schedule = await repo.findOne({ where: { id } });

    if (!schedule) throw new Error('Schedule not found');

    await repo.remove(schedule);
    return true;
  },
};
