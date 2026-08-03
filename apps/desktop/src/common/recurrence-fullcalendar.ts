import { type RRule, type RRuleSet, rrulestr, type ByWeekday } from 'rrule';

import {
  FREQ_TO_FC,
  WEEKDAY_TO_FC,
  asSingleRRule,
  extractRuleBody,
  optionsToWeekdayCodes,
} from './recurrence-internal';

export type FullCalendarRRuleInput = {
  freq: string;
  interval?: number;
  byweekday?: string[];
  bymonthday?: number[];
  dtstart: Date | string;
  until?: Date | string;
  count?: number;
};

/** FullCalendar @fullcalendar/rrule 용 객체 */
export function toFullCalendarRRule(rule: string, dtstart: Date): FullCalendarRRuleInput | null {
  try {
    const parsed = rrulestr(`RRULE:${extractRuleBody(rule)}`, { dtstart });
    const single = asSingleRRule(parsed);
    if (!single) {
      return null;
    }

    const { options } = single;
    const freq = FREQ_TO_FC[options.freq];
    if (!freq) {
      return null;
    }

    const result: FullCalendarRRuleInput = {
      freq,
      interval: options.interval || 1,
      dtstart,
    };

    const weekdays = optionsToWeekdayCodes(options.byweekday as ByWeekday | ByWeekday[] | null);
    if (weekdays.length > 0) {
      result.byweekday = weekdays.map((code) => WEEKDAY_TO_FC[code]);
    }

    if (options.bymonthday?.length) {
      result.bymonthday = [...options.bymonthday];
    }
    if (options.until) {
      result.until = options.until;
    }
    if (options.count) {
      result.count = options.count;
    }

    return result;
  } catch {
    return null;
  }
}

// re-export types used only for narrowing RRuleSet in consumers if needed
export type { RRule, RRuleSet };
