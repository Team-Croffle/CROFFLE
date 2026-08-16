import { t as translate } from '@croffledev/common';

import { settingService } from './setting/setting-service';

/** Translate using the current app language setting. */
export function t(key: string, values?: Record<string, string | number>): string {
  return translate(key, settingService.get().general.language, values);
}
