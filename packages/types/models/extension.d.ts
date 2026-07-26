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

/** Manifest `contributes.configuration` 항목 (런타임 extensionId/render 제외) */
export type ConfigurationTabManifest = Omit<
  ConfigurationTabContribution,
  'extensionId' | 'extensionName' | 'render'
>;

/** Manifest `contributes.views` 항목 */
export type ViewManifest = {
  id: string;
  title: string;
  subtitle: string;
  /** JSON에서는 보통 string; 호스트 기본 메뉴는 컴포넌트도 허용 */
  icon?: unknown;
  url: string;
};

/** 런타임 뷰 (사이드바 등) — manifest + host 메타 */
export type FeatureView = ViewManifest & {
  active?: boolean;
  extensionName?: string;
  extensionId?: string;
};

/** Manifest `contributes.contextMenus` 항목 (action은 코드에서만) */
export type ContextMenuManifest = {
  id: string;
  label: string;
  targetView?: string[];
  disabled?: boolean;
};

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

/** `croffle-manifest.json` on disk */
export type CroffleManifest = {
  id: string;
  name: string;
  version: string;
  author: string;
  description?: string;
  main?: string;
  engines?: {
    /** e.g. ">=1.0.0" — currently only `>=x.y.z` is enforced */
    croffle?: string;
  };
  contributes?: ExtensionContributes;
};

/** Host-loaded extension (manifest + enabled) */
export type ExtensionInfo = CroffleManifest & {
  enabled: boolean;
};
