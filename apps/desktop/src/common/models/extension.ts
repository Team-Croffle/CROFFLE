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

/** Manifest `contributes.configuration` 항목 (런타임 extensionId/render 제외) */
export type ConfigurationTabManifest = {
  id: string;
  label: string;
  icon?: unknown;
  order?: number;
  sections?: ConfigurationSectionContribution[];
};

/** Host runtime: settings modal tab (includes render hook). */
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

/** Manifest `contributes.views` 항목 */
export type ViewManifest = {
  id: string;
  title: string;
  subtitle: string;
  icon?: unknown;
  url: string;
};

/** Host runtime: sidebar / registered view. */
export type FeatureView = ViewManifest & {
  active?: boolean;
  extensionName?: string;
  extensionId?: string;
};

/** Manifest `contributes.contextMenus` 항목 */
export type ContextMenuManifest = {
  id: string;
  label: string;
  targetView?: string[];
  disabled?: boolean;
};

/** Host runtime: context menu with callbacks. */
export type FeatureContextMenu = ContextMenuManifest & {
  action: (targetElement: HTMLElement | null) => void;
  condition?: (targetElement: HTMLElement | null) => boolean;
  extensionId?: string;
  extensionName?: string;
};

export type ExtensionContributes = {
  views?: ViewManifest[];
  contextMenus?: ContextMenuManifest[];
  configuration?: ConfigurationTabManifest[];
};

export type ExtensionEngines = {
  croffle?: string;
};

/** `croffle-manifest.json` on disk */
export type CroffleManifest = {
  id: string;
  name: string;
  version: string;
  author: string;
  description?: string;
  main?: string;
  engines?: ExtensionEngines;
  contributes?: ExtensionContributes;
};

/** Host-loaded extension (manifest + enabled). */
export type ExtensionInfo = CroffleManifest & {
  enabled: boolean;
};
