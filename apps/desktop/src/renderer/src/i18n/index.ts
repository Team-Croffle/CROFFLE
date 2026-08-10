import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import ko from './locales/ko.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, ko },
});

export function setI18nLocale(locale: string): void {
  i18n.global.locale.value = locale === 'ko' ? 'ko' : 'en';
}

export function translateOrRaw(key: string): string {
  return i18n.global.te(key) ? String(i18n.global.t(key)) : key;
}
