export type ConfigItemType = 'string' | 'number' | 'boolean' | 'select' | 'path';

export type ConfigItemSchema<T = unknown> = {
  type: ConfigItemType;
  label: string;
  description?: string;
  defaultValue: T;
  options?: {
    label: string;
    value: T extends string | number ? T : never;
  }[];
};

export type SettingsSectionContribution = {
  id: string;
  title?: string;
  description?: string;
  items: Record<string, ConfigItemSchema>;
};

export type SettingsTabContribution = {
  id: string;
  label: string;
  icon?: unknown;
  pluginId: string;
  pluginName?: string;
  order?: number;
  render?: (container: HTMLElement) => void;
  sections?: SettingsSectionContribution[];
};

export type SettingsTabManifest = Omit<
  SettingsTabContribution,
  'pluginId' | 'pluginName' | 'render'
>;

export type FeatureView = {
  id: string;
  title: string;
  subtitle: string;
  icon: unknown;
  url: string;
  active?: boolean;
  pluginName?: string;
  pluginId?: string;
};

export type FeatureContextMenu = {
  id: string;
  label: string;
  action: (targetElement: HTMLElement | null) => void;
  condition?: (targetElement: HTMLElement | null) => boolean;
  disabled?: boolean;
  targetView?: string[];
  pluginId?: string;
};

export type PluginInfo = {
  enabled: boolean;
  id: string;
  name: string;
  version: string;
  author: string;
  main?: string;
  description?: string;
  features: {
    views?: FeatureView[];
    contextMenus?: FeatureContextMenu[];
    settingsTabs?: SettingsTabManifest[];
  };
};
