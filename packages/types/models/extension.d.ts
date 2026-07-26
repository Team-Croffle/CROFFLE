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

export type ConfigurationSectionContribution = {
  id: string;
  title?: string;
  description?: string;
  items: Record<string, ConfigItemSchema>;
};

export type ConfigurationTabContribution = {
  id: string;
  label: string;
  icon?: unknown;
  extensionId: string;
  extensionName?: string;
  order?: number;
  render?: (container: HTMLElement) => void;
  sections?: ConfigurationSectionContribution[];
};

/** Manifest에 선언 가능한 configuration 탭 (render 제외) */
export type ConfigurationTabManifest = Omit<
  ConfigurationTabContribution,
  'extensionId' | 'extensionName' | 'render'
>;

export type FeatureView = {
  id: string;
  title: string;
  subtitle: string;
  icon: unknown;
  url: string;
  active?: boolean;
  extensionName?: string;
  extensionId?: string;
};

export type FeatureContextMenu = {
  id: string;
  label: string;
  action: (targetElement: HTMLElement | null) => void;
  condition?: (targetElement: HTMLElement | null) => boolean;
  disabled?: boolean;
  targetView?: string[];
  extensionId?: string;
};

export type ExtensionInfo = {
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
    configurationTabs?: ConfigurationTabManifest[];
  };
};

/** @deprecated Use ExtensionInfo */
export type PluginInfo = ExtensionInfo;
/** @deprecated Use ConfigurationSectionContribution */
export type SettingsSectionContribution = ConfigurationSectionContribution;
/** @deprecated Use ConfigurationTabContribution */
export type SettingsTabContribution = ConfigurationTabContribution;
/** @deprecated Use ConfigurationTabManifest */
export type SettingsTabManifest = ConfigurationTabManifest;
