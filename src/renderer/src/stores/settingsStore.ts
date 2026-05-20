import type { SettingsTabContribution, SettingsTabManifest } from '@croffledev/croffle-types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const BUILTIN_TAB_IDS = ['general', 'calendar', 'account', 'notifications'] as const;
export type BuiltinSettingsTabId = (typeof BUILTIN_TAB_IDS)[number];

export const useSettingsStore = defineStore('settings', () => {
  const extensionTabs = ref<SettingsTabContribution[]>([]);

  const getTabCompositeId = (tab: Pick<SettingsTabContribution, 'pluginId' | 'id'>) =>
    `${tab.pluginId}:${tab.id}`;

  const registerTab = (tab: SettingsTabContribution) => {
    const compositeId = getTabCompositeId(tab);
    if (extensionTabs.value.some((t) => getTabCompositeId(t) === compositeId)) {
      return;
    }
    extensionTabs.value.push(tab);
  };

  const registerManifestTabs = (
    pluginId: string,
    pluginName: string,
    manifests: SettingsTabManifest[] | undefined,
  ) => {
    if (!manifests?.length) return;
    for (const manifest of manifests) {
      registerTab({
        ...manifest,
        pluginId,
        pluginName,
      });
    }
  };

  const sortedExtensionTabs = computed(() =>
    [...extensionTabs.value].sort((a, b) => (a.order ?? 100) - (b.order ?? 100)),
  );

  const findExtensionTab = (compositeId: string) =>
    extensionTabs.value.find((t) => getTabCompositeId(t) === compositeId);

  return {
    extensionTabs,
    sortedExtensionTabs,
    registerTab,
    registerManifestTabs,
    getTabCompositeId,
    findExtensionTab,
    isBuiltinTab: (id: string): id is BuiltinSettingsTabId =>
      (BUILTIN_TAB_IDS as readonly string[]).includes(id),
  };
});
