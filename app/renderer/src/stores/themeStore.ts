import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';

export const useThemeStore = defineStore('darkTheme', () => {
  const isDark = ref<boolean>(false);

  onMounted(() => {
    const theme = localStorage.getItem('theme');
    if (!theme) {
      isDark.value = false;
    } else {
      isDark.value = theme === 'dark';
      document.documentElement.classList.add('dark');
    }
  });

  const changeTheme = (): void => {
    const target = !isDark.value;
    localStorage.setItem('theme', target ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
    isDark.value = target;
  };

  return {
    isDark,
    changeTheme,
  };
});
