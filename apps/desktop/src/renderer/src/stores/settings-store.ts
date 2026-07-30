import type { ConfigurationTabContribution, ConfigurationTabManifest } from '@croffledev/common';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const BUILTIN_TAB_IDS = ['general', 'calendar', 'account', 'notifications'] as const;
export type BuiltinSettingsTabId = (typeof BUILTIN_TAB_IDS)[number];

const getTabCompositeId = (tab: Pick<ConfigurationTabContribution, 'extensionId' | 'id'>) =>
  `${tab.extensionId}:${tab.id}`;

export const useSettingsStore = defineStore('settings', () => {
  const extensionTabs = ref<ConfigurationTabContribution[]>([]);

  const registerTab = (tab: ConfigurationTabContribution) => {
    const compositeId = getTabCompositeId(tab);
    if (extensionTabs.value.some((t) => getTabCompositeId(t) === compositeId)) {
      return;
    }
    extensionTabs.value.push(tab);
  };

  const registerManifestTabs = (
    extensionId: string,
    extensionName: string,
    manifests: ConfigurationTabManifest[] | undefined,
  ) => {
    if (!manifests?.length) {
      return;
    }
    for (const manifest of manifests) {
      registerTab({
        ...manifest,
        extensionId,
        extensionName,
      });
    }
  };

  const unregisterExtensionConfigurationTabs = (extensionId: string) => {
    extensionTabs.value = extensionTabs.value.filter((t) => t.extensionId !== extensionId);
  };

  const sortedExtensionTabs = computed(() =>
    [...extensionTabs.value].toSorted((a, b) => (a.order ?? 100) - (b.order ?? 100)),
  );

  const findExtensionTab = (compositeId: string) =>
    extensionTabs.value.find((t) => getTabCompositeId(t) === compositeId);

  return {
    extensionTabs,
    sortedExtensionTabs,
    registerTab,
    registerManifestTabs,
    unregisterExtensionConfigurationTabs,
    getTabCompositeId,
    findExtensionTab,
    isBuiltinTab: (id: string): id is BuiltinSettingsTabId =>
      (BUILTIN_TAB_IDS as readonly string[]).includes(id),
  };
});
