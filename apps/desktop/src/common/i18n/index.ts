import { AppSettingLanguage } from '../enums';
import en from './locales/en.json';
import ko from './locales/ko.json';

export type MessageTree = { [key: string]: string | MessageTree };
type MessageValues = Record<string, string | number>;

/** Shared locale catalogs for main + renderer (one JSON per language). */
export const localeMessages: Record<AppSettingLanguage, MessageTree> = {
  [AppSettingLanguage.EN]: en,
  [AppSettingLanguage.KO]: ko,
};

export function resolveAppLocale(locale: string | undefined | null): AppSettingLanguage {
  return locale === AppSettingLanguage.KO ? AppSettingLanguage.KO : AppSettingLanguage.EN;
}

function lookup(tree: MessageTree, key: string): string | undefined {
  const parts = key.split('.');
  let current: string | MessageTree | undefined = tree;

  for (const part of parts) {
    if (current === undefined || typeof current === 'string') {
      return undefined;
    }
    current = current[part];
  }

  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, values?: MessageValues): string {
  if (!values) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = values[name];
    return value === undefined || value === null ? `{${name}}` : String(value);
  });
}

/** Lightweight i18n for main / shared code (no vue-i18n). */
export function t(key: string, locale?: string | null, values?: MessageValues): string {
  const resolved = resolveAppLocale(locale);
  const primary = lookup(localeMessages[resolved], key);
  const fallback =
    resolved === AppSettingLanguage.EN
      ? undefined
      : lookup(localeMessages[AppSettingLanguage.EN], key);
  const template = primary ?? fallback ?? key;
  return interpolate(template, values);
}
