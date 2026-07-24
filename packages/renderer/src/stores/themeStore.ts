import { AppSettingTheme } from '@croffledev/shared';
import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';

const resolveIsDark = (theme: AppSettingTheme): boolean => {
  if (theme === AppSettingTheme.DARK) return true;
  if (theme === AppSettingTheme.LIGHT) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = defineStore('darkTheme', () => {
  const isDark = ref<boolean>(false);
  const currentTheme = ref<AppSettingTheme>(AppSettingTheme.SYSTEM);

  const applyDomTheme = (dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    isDark.value = dark;
  };

  const applyFromSettings = (theme: AppSettingTheme) => {
    currentTheme.value = theme;
    applyDomTheme(resolveIsDark(theme));
  };

  onMounted(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      isDark.value = stored === 'dark';
      document.documentElement.classList.toggle('dark', isDark.value);
    }
  });

  /** 타이틀 바 빠른 전환 (light ↔ dark) */
  const changeTheme = (): void => {
    const next =
      currentTheme.value === AppSettingTheme.DARK ? AppSettingTheme.LIGHT : AppSettingTheme.DARK;
    applyFromSettings(next);
  };

  return {
    isDark,
    currentTheme,
    applyFromSettings,
    changeTheme,
  };
});
